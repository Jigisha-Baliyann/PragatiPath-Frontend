import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssuesContext';
import { mockUsers } from '../constants';
import ReportedIssueRow from '../components/ReportedIssueRow';
import ProfileEditModal from '../components/ProfileEditModal';
import { IssueStatus, Badge, Issue } from '../types';

const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { issues, getIssuesByReporter } = useIssues();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) return null; // protected route ensures user exists

  const MotionDiv = motion.div;
  const MotionImg = motion.img;

  // Handle opening edit modal
  const handleEditClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Handle closing edit modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Handle saving profile changes
  const handleSaveProfile = useCallback(async (data: { name: string; avatarUrl: string }) => {
    await updateUser({ ...user, ...data });
  }, [user, updateUser]);

  const AccountDetailsEditor = React.memo(() => (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Account Details</h2>
        <button
          onClick={handleEditClick}
          className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors px-4 py-2 rounded-full hover:bg-cyan-500/10"
        >
          Edit Profile
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatarUrl || `https://picsum.photos/seed/${user.id}/100`}
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-gray-600 object-cover"
          />
          <div>
            <p className="text-lg font-semibold text-white">{user.name}</p>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  ));

  const AdminProfile = () => {
    const keyIssues = issues
      .filter(
        (issue) =>
          (issue.priority === 'Critical' || issue.priority === 'High') &&
          ![IssueStatus.Resolved, IssueStatus.Rejected].includes(issue.status)
      )
      .sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());

    return (
      <>
        <header className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-gray-800/50 rounded-lg border border-gray-700 mb-8">
          <MotionImg
            src={user.avatarUrl}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-cyan-400 shadow-lg"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          />
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold text-white">{user.name}</h1>
            <p className="text-lg font-semibold text-yellow-400 mt-2">Administrator Account</p>
          </div>
        </header>

        <AccountDetailsEditor />

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">High-Priority Active Issues ({keyIssues.length})</h2>
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-700">
              {keyIssues.length > 0 ? (
                keyIssues.map((issue) => <ReportedIssueRow key={issue.id} issue={issue} />)
              ) : (
                <div className="p-8 text-center text-gray-400">
                  No high-priority issues require attention.
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const CitizenProfile = () => {
    const fullUserDetails = mockUsers.find((u) => u.id === user.id);
    
    // Get reported issues by the current user's name
    const reportedIssues = getIssuesByReporter(user.name)
      .sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());
    
    // Calculate points based on reported issues
    const points = reportedIssues.reduce((total, issue) => {
      let issuePoints = 0;
      switch (issue.priority) {
        case 'Critical': issuePoints = 100; break;
        case 'High': issuePoints = 75; break;
        case 'Medium': issuePoints = 50; break;
        case 'Low': issuePoints = 25; break;
      }
      if (issue.status === IssueStatus.Resolved) issuePoints *= 1.5;
      return total + issuePoints;
    }, 0);
    
    const rank = fullUserDetails?.rank ?? 'N/A';
    const badges: Badge[] = fullUserDetails?.badges || [];

    return (
      <>
        <header className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-gray-800/50 rounded-lg border border-gray-700 mb-8">
          <MotionImg
            src={user.avatarUrl}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-cyan-400 shadow-lg"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          />
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold text-white">{user.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-gray-300">
              <span className="font-semibold text-cyan-400 text-lg">{points.toLocaleString()} Points</span>
              <span className="text-gray-500">|</span>
              <span>Community Rank: <span className="font-bold text-white">#{rank}</span></span>
            </div>
          </div>
        </header>

        <AccountDetailsEditor />

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">My Badges</h2>
          {badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge, idx) => (
                <MotionDiv
                  key={badge.id}
                  className="bg-gray-800 p-4 rounded-lg text-center flex flex-col items-center border border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                >
                  <badge.icon className="w-12 h-12 text-yellow-400 mb-2" />
                  <h3 className="font-semibold text-white">{badge.name}</h3>
                  <p className="text-xs text-gray-400">{badge.description}</p>
                </MotionDiv>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
              <p className="text-gray-400">No badges earned yet. Keep reporting to unlock them!</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">My Reported Issues ({reportedIssues.length})</h2>
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-700">
              {reportedIssues.length > 0 ? (
                reportedIssues.map((issue) => <ReportedIssueRow key={issue.id} issue={issue} />)
              ) : (
                <div className="p-8 text-center text-gray-400">
                  You haven't reported any issues yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {user.role === 'admin' ? <AdminProfile /> : <CitizenProfile />}
      </MotionDiv>
      
      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={user}
        onSave={handleSaveProfile}
      />
    </>
  );
};

export default UserProfile;

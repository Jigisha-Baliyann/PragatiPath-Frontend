
import React from 'react';
import Accordion from '../components/ui/Accordion';

const faqItems = [
  {
    title: "How to assign reports to staff?",
    content: "Navigate to the 'Reports' page, find the relevant report, click 'View Details', and use the 'Assign Staff' dropdown to select an available team member. An automatic notification will be sent to them."
  },
  {
    title: "How do AI closure reports work?",
    content: "When a report is marked as 'Resolved' with proof of work uploaded, you can click 'Generate AI Report'. The system analyzes the initial report, timeline, and resolution proof to generate a formal closure document. Your digital signature is automatically applied."
  },
  {
    title: "How to upload/manage docs & signatures?",
    content: "Go to your 'Profile' page. You will find sections to upload required official documents and a separate section to create or upload your digital signature. These are securely stored and used only for official purposes."
  },
  {
    title: "How do SLA & escalations function?",
    content: "Each report category has a pre-defined Service Level Agreement (SLA) for resolution time. If a report is not moved to 'In Progress' or 'Resolved' within its SLA, it is automatically flagged and escalated to the department head for immediate attention."
  },
  {
    title: "How to filter issues on map/grid?",
    content: "On the 'Reports' page, use the filters at the top to narrow down issues by status, category, date range, or department. The grid and map views will update in real-time to reflect your selections."
  },
  {
    title: "How to export analytics & leaderboard?",
    content: "On the Dashboard and Leaderboard pages, look for 'Export' buttons, usually near the top right or bottom of a section. You can typically export data as a PDF for reporting or CSV for further analysis in spreadsheets."
  },
];


const HelpPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Help & FAQ</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Find answers to common questions about using the PragatiPath Admin Dashboard.</p>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <Accordion items={faqItems} />
      </div>
    </div>
  );
};

export default HelpPage;

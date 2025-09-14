import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Report } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { MapPin, X, UploadCloud } from '../components/shared/Icons';
import { GoogleGenAI } from '@google/genai';

const mockReports: Report[] = [
  { id: 'PR-1234', category: 'Pothole', location: '123 Main St, Mumbai', status: 'Pending', reporter: 'Amit Patel', assignedTo: 'Public Works', date: '2024-07-28', severity: 'High' },
  { id: 'PR-1235', category: 'Waste Management', location: '456 Park Ave, Delhi', status: 'In Progress', reporter: 'Priya Singh', assignedTo: 'Sanitation Dept', date: '2024-07-27', severity: 'Medium' },
  { id: 'PR-1236', category: 'Streetlight', location: '789 Lake Rd, Bangalore', status: 'Resolved', reporter: 'Rajesh Kumar', assignedTo: 'Electricity Dept', date: '2024-07-26', severity: 'Low' },
  { id: 'PR-1237', category: 'Water Leakage', location: '101 Riverfront, Ahmedabad', status: 'Pending', reporter: 'Sunita Gupta', assignedTo: 'Water Works', date: '2024-07-28', severity: 'High' },
  { id: 'PR-1238', category: 'Other', location: '212 Market St, Kolkata', status: 'Resolved', reporter: 'Vikram Bose', assignedTo: 'Admin', date: '2024-07-25', severity: 'Medium' },
];

const ReportsPage: React.FC = () => {
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [filteredReports, setFilteredReports] = useState<Report[]>(mockReports);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);

  const handleApplyFilters = () => {
    let reports = [...mockReports];

    if (statusFilter !== 'All') {
      reports = reports.filter(report => report.status === statusFilter);
    }

    if (categoryFilter !== 'All') {
      reports = reports.filter(report => report.category === categoryFilter);
    }

    if (startDate) {
      reports = reports.filter(report => new Date(report.date) >= new Date(startDate));
    }

    if (endDate) {
      reports = reports.filter(report => new Date(report.date) <= new Date(endDate));
    }
    
    setFilteredReports(reports);
  };

  const handleClearFilters = () => {
    setStatusFilter('All');
    setCategoryFilter('All');
    setStartDate('');
    setEndDate('');
    setFilteredReports(mockReports);
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
  };
  
  const handleCloseModal = () => {
    setSelectedReport(null);
  };
  
  const handleGenerateAIReport = async (reportId: string) => {
    setGeneratingReportId(reportId);
    try {
        const report = mockReports.find(r => r.id === reportId);
        if (!report) {
            throw new Error('Report not found');
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `
Generate a formal closure report for the following civic issue.
The report should be professional, concise, and suitable for official records.
It should summarize the issue, the actions taken for resolution, and confirm the closure.

**Issue Details:**
- **Report ID:** ${report.id}
- **Category:** ${report.category}
- **Location:** ${report.location}
- **Date Reported:** ${report.date}
- **Severity:** ${report.severity}
- **Status:** ${report.status}
- **Assigned To:** ${report.assignedTo}
- **Reported By:** ${report.reporter}

Based on these details, please write the closure report.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        const generatedText = response.text;
        alert(`AI Generated Closure Report for ${reportId}:\n\n${generatedText}`);

    } catch (error) {
        console.error("Error generating AI report:", error);
        alert('Failed to generate AI report. Please check the console for details.');
    } finally {
        setGeneratingReportId(null);
    }
  };

  const reportStatuses = ['All', 'Pending', 'In Progress', 'Resolved'];
  const reportCategories = ['All', 'Pothole', 'Waste Management', 'Streetlight', 'Water Leakage', 'Other'];


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Reports Management</h1>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Live Issues Feed</CardTitle>
            <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
              <button onClick={() => setView('grid')} className={`px-3 py-1 text-sm rounded-md ${view === 'grid' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-400'}`}>Grid</button>
              <button onClick={() => setView('map')} className={`px-3 py-1 text-sm rounded-md ${view === 'map' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-400'}`}>Map</button>
            </div>
          </div>
        </CardHeader>
        
        {view === 'grid' && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select id="status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400 dark:focus:border-indigo-400">
                  {reportStatuses.map(status => <option key={status}>{status}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select id="category" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400 dark:focus:border-indigo-400">
                  {reportCategories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400 dark:focus:border-indigo-400"/>
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400 dark:focus:border-indigo-400"/>
              </div>
              <div className="flex space-x-2">
                <button onClick={handleApplyFilters} className="w-full justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Apply</button>
                <button onClick={handleClearFilters} className="w-full justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Clear</button>
              </div>
            </div>
          </div>
        )}

        <CardContent className="pt-6">
          {view === 'grid' ? <ReportsTable reports={filteredReports} onViewDetails={handleViewDetails} onGenerateReport={handleGenerateAIReport} generatingReportId={generatingReportId} /> : <ReportsMap />}
        </CardContent>
      </Card>
      
      <AnimatePresence>
        {selectedReport && (
            <ReportDetailsModal report={selectedReport} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

interface ReportsTableProps {
    reports: Report[];
    onViewDetails: (report: Report) => void;
    onGenerateReport: (reportId: string) => void;
    generatingReportId: string | null;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ reports, onViewDetails, onGenerateReport, generatingReportId }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {reports.length > 0 ? (
            reports.map((report) => (
            <tr key={report.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{report.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.location}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                 <Badge variant={report.status === 'Resolved' ? 'success' : report.status === 'In Progress' ? 'warning' : 'destructive'}>{report.status}</Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.assignedTo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-4">
                  <button onClick={() => onViewDetails(report)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                    View Details
                  </button>
                  {report.status === 'Resolved' && (
                    <button
                        onClick={() => onGenerateReport(report.id)}
                        disabled={generatingReportId === report.id}
                        className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {generatingReportId === report.id ? 'Generating...' : 'AI Report'}
                    </button>
                  )}
                </div>
              </td>
            </tr>
            ))
           ) : (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No reports found for the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const ReportDetailsModal: React.FC<{ report: Report; onClose: () => void; }> = ({ report, onClose }) => {
    const [selectedAssignee, setSelectedAssignee] = React.useState(report.assignedTo);
    const [selectedStatus, setSelectedStatus] = React.useState<Report['status']>(report.status);
    const [resolutionProof, setResolutionProof] = React.useState<File | null>(null);

    const assignableStaff = ['Public Works', 'Sanitation Dept', 'Electricity Dept', 'Water Works', 'Admin'];
    const statusOptions: Report['status'][] = ['Pending', 'In Progress', 'Resolved'];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setResolutionProof(event.target.files[0]);
        }
    };

    const handleUpdateReport = () => {
        if (selectedStatus === 'Resolved' && report.status !== 'Resolved' && !resolutionProof) {
            alert('Please upload resolution proof to mark the report as resolved.');
            return;
        }
        // In a real app, you'd dispatch an action here to update the report state
        alert(`Report ${report.id} has been updated. Status: ${selectedStatus}, Assignee: ${selectedAssignee}.`);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl"
                onClick={e => e.stopPropagation()}
            >
                <Card className="border-0">
                    <CardHeader className="flex flex-row items-center justify-between border-b dark:border-gray-700">
                        <div>
                            <CardTitle>Report Details: {report.id}</CardTitle>
                            <CardDescription>Comprehensive overview of the civic issue.</CardDescription>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </button>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h4>
                            <p className="text-base text-gray-900 dark:text-white">{report.category}</p>
                        </div>
                         <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
                            <p><Badge variant={report.status === 'Resolved' ? 'success' : report.status === 'In Progress' ? 'warning' : 'destructive'}>{report.status}</Badge></p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h4>
                            <p className="text-base text-gray-900 dark:text-white">{report.location}</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reported By</h4>
                            <p className="text-base text-gray-900 dark:text-white">{report.reporter}</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Reported</h4>
                            <p className="text-base text-gray-900 dark:text-white">{report.date}</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</h4>
                            <p className="text-base text-gray-900 dark:text-white">{report.assignedTo}</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Severity</h4>
                            <p className="text-base text-gray-900 dark:text-white">{report.severity}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 dark:bg-gray-900/50 p-6 flex flex-col space-y-4">
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign To</label>
                                <select 
                                    id="assignee" 
                                    value={selectedAssignee} 
                                    onChange={e => setSelectedAssignee(e.target.value)}
                                    className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                >
                                    {assignableStaff.map(staff => <option key={staff} value={staff}>{staff}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="modal-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update Status</label>
                                <select 
                                    id="modal-status" 
                                    value={selectedStatus} 
                                    onChange={e => setSelectedStatus(e.target.value as Report['status'])}
                                    className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                >
                                    {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        {selectedStatus === 'Resolved' && (
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resolution Proof</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
                                    <div className="space-y-1 text-center">
                                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:ring-offset-gray-900">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                        {resolutionProof && <p className="mt-2 text-sm text-green-600 dark:text-green-400">Selected: {resolutionProof.name}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="w-full flex justify-end">
                            <button
                                onClick={handleUpdateReport}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Update Report
                            </button>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </motion.div>
    );
};


const ReportsMap: React.FC = () => {
    return (
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
                <MapPin className="w-12 h-12 mx-auto" />
                <p className="mt-2 font-semibold">Map View Placeholder</p>
                <p className="text-sm">Hotspot map of top issue locations will be displayed here.</p>
            </div>
        </div>
    );
}

export default ReportsPage;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { UploadCloud } from '../components/shared/Icons';

const ProfilePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Admin Profile & Documents</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Official Documents</CardTitle>
                    <CardDescription>Upload and manage required documents for verification.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                           Drag & drop your documents here or click to browse.
                        </p>
                        <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            Upload Files
                        </button>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-medium">Uploaded Documents:</h4>
                        <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                                <span>Aadhaar_Card.pdf</span>
                                <span className="text-green-500 font-semibold">Verified</span>
                            </li>
                            <li className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                                <span>Appointment_Letter.pdf</span>
                                <span className="text-green-500 font-semibold">Verified</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Digital Signature</CardTitle>
                    <CardDescription>This signature will be auto-applied to AI closure reports.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center h-32">
                        <p className="text-2xl italic font-serif text-gray-800 dark:text-gray-200">Admin User</p>
                    </div>
                    <button className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Update Signature
                    </button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

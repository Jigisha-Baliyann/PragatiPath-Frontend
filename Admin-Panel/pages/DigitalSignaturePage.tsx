
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { UploadCloud } from '../components/shared/Icons';

const DigitalSignaturePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Digital Signature Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Digital Signature</CardTitle>
          <CardDescription>
            This signature will be automatically applied to AI-generated closure reports.
            Manage your signature by uploading an image or drawing a new one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Current Signature</h3>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center h-40">
              <p className="text-4xl italic font-serif text-gray-800 dark:text-gray-200">Admin User</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option 1: Upload Signature */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Upload New Signature</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center h-full flex flex-col justify-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Drag & drop an image or click to browse.
                </p>
                <button className="mt-4 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Upload Image
                </button>
              </div>
            </div>

            {/* Option 2: Draw Signature */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Draw Signature</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 h-full flex flex-col justify-center items-center">
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-md cursor-not-allowed flex items-center justify-center">
                   <p className="text-gray-400">Drawing pad placeholder</p>
                </div>
                 <button className="mt-4 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                    Clear Signature
                </button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Save Signature
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DigitalSignaturePage;

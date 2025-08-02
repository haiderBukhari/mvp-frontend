import React from 'react';

interface BookingPDFViewProps {
  formData: any;
  campaignName: string;
  campaignDescription: string;
}

export const BookingPDFView: React.FC<BookingPDFViewProps> = ({ 
  formData, 
  campaignName, 
  campaignDescription 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not specified';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-blue-600">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">MediaCo</h1>
          <h2 className="text-xl font-semibold text-gray-700">Insertion Order</h2>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600 mb-1">
            {formData.campaignRef}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Generated: {formatDate(new Date())}
          </div>
          <div className="inline-block px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded">
            SUBMITTED
          </div>
        </div>
      </div>

      {/* Client Details */}
      <div className="mb-8">
        <h3 className="text-lg font-bold bg-gray-100 p-3 text-gray-700 mb-4">Client Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Client Name</div>
            <div className="text-gray-600">{formData.clientName || 'Not specified'}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Contact Person</div>
            <div className="text-gray-600">{formData.contactName || 'Not specified'}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Contact Email</div>
            <div className="text-gray-600">{formData.contactEmail || 'Not specified'}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Contact Phone</div>
            <div className="text-gray-600">{formData.contactPhone || 'Not specified'}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Company Address</div>
            <div className="text-gray-600">{formData.address || 'Not specified'}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Industry Segment</div>
            <div className="text-gray-600">{formData.industrySegment || 'Not specified'}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Tax Registration #</div>
            <div className="text-gray-600">{formData.taxRegistrationNo || 'Not specified'}</div>
          </div>
        </div>
      </div>

      {/* Campaign Details */}
      <div className="mb-8">
        <h3 className="text-lg font-bold bg-gray-100 p-3 text-gray-700 mb-4">Campaign Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Campaign Name</div>
            <div className="text-gray-600 font-medium text-lg">{campaignName || 'Not specified'}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Campaign Reference ID</div>
            <div className="text-gray-600">{formData.campaignRef || 'Not specified'}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">📅 Start Date</div>
            <div className="text-gray-600">{formatDate(formData.startDate)}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">📅 End Date</div>
            <div className="text-gray-600">{formatDate(formData.endDate)}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">📅 Creative Delivery Date</div>
            <div className="text-gray-600">{formatDate(formData.creativeDeliveryDate)}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Media Type</div>
            <div className="text-gray-600">{formData.mediaType || 'Not specified'}</div>
          </div>
          <div className="border border-gray-200 p-4 col-span-2">
            <div className="font-semibold text-gray-700 mb-1">Placement Preferences</div>
            <div className="text-gray-600">{formData.placementPreferences || 'Not specified'}</div>
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className="mb-8">
        <h3 className="text-lg font-bold bg-gray-100 p-3 text-gray-700 mb-4">Financial Details</h3>
        <div className="border border-gray-200">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            <span className="font-semibold text-gray-700">Gross Amount</span>
            <span className="text-gray-600">{formatCurrency(formData.grossAmount || 0)}</span>
          </div>
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <span className="font-semibold text-gray-700">Partner Discount ({formData.partnerDiscount || 0}%)</span>
            <span className="text-red-600">-{formatCurrency((formData.grossAmount * (formData.partnerDiscount || 0)) / 100)}</span>
          </div>
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            <span className="font-semibold text-gray-700">Additional Charges</span>
            <span className="text-gray-600">{formatCurrency(formData.additionalCharges || 0)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-yellow-50 border-2 border-yellow-200">
            <span className="font-bold text-gray-800 text-lg">Net Amount</span>
            <span className="font-bold text-gray-800 text-xl">{formatCurrency(formData.netAmount || 0)}</span>
          </div>
        </div>
      </div>

      {/* Creative & Instructions */}
      <div className="mb-8">
        <h3 className="text-lg font-bold bg-gray-100 p-3 text-gray-700 mb-4">Creative & Instructions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">📎 Creative File Link</div>
            <div className="text-blue-600 underline">{formData.creativeFileLink || 'Not provided'}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Creative Specs</div>
            <div className="text-gray-600">{formData.creativeSpecs || 'Not specified'}</div>
          </div>
          <div className="border border-gray-200 p-4 col-span-2">
            <div className="font-semibold text-gray-700 mb-1">Special Instructions</div>
            <div className="text-gray-600">{formData.specialInstructions || 'None'}</div>
          </div>
        </div>
      </div>

      {/* Authorization Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold bg-gray-100 p-3 text-gray-700 mb-4">Authorization</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Signatory Name</div>
            <div className="text-gray-600">{formData.signatoryName || 'Not specified'}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">Title</div>
            <div className="text-gray-600">{formData.signatoryTitle || 'Not specified'}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">📅 Signature Date</div>
            <div className="text-gray-600">{formatDate(formData.signatureDate)}</div>
          </div>
          <div className="border border-gray-200 p-4">
            <div className="font-semibold text-gray-700 mb-1">✍️ Signature</div>
            <div className="text-gray-600">Digital signature pending</div>
          </div>
        </div>
      </div>

      {/* Booking Timeline */}
      <div className="mb-8">
        <h3 className="text-lg font-bold bg-gray-100 p-3 text-gray-700 mb-4">Booking Timeline</h3>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">1</div>
            <div className="text-xs font-medium text-blue-600">Submitted</div>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold mb-2">2</div>
            <div className="text-xs font-medium text-gray-400">PDF Generated</div>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold mb-2">3</div>
            <div className="text-xs font-medium text-gray-400">Sent</div>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold mb-2">4</div>
            <div className="text-xs font-medium text-gray-400">In Progress</div>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold mb-2">5</div>
            <div className="text-xs font-medium text-gray-400">Confirmed</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
        <div className="mb-1">MediaCo – 123 Fictional Road, Singapore 000000</div>
        <div className="mb-1">Email: salesrep@mediaco.test | Website: www.mediaco.test</div>
        <div>Page 1 of 1</div>
      </div>
    </div>
  );
};
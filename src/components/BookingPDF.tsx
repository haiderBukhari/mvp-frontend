import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomStyle: 'solid',
    borderBottomWidth: 2,
    borderBottomColor: '#1E40AF',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 5,
  },
  reference: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#F3F4F6',
    padding: 8,
    color: '#374151',
    marginBottom: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomStyle: 'solid',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
  tableCol: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 0,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  tableCellHeader: {
    margin: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  tableCell: {
    margin: 8,
    fontSize: 11,
    color: '#6B7280',
  },
  financialTable: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  financialRow: {
    flexDirection: 'row',
    borderBottomStyle: 'solid',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
  financialLabel: {
    width: '70%',
    borderStyle: 'solid',
    borderWidth: 0,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    padding: 8,
    backgroundColor: '#F9FAFB',
  },
  financialValue: {
    width: '30%',
    padding: 8,
    textAlign: 'right',
  },
  netAmount: {
    backgroundColor: '#FEF3C7',
    fontWeight: 'bold',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressStep: {
    padding: 8,
    marginRight: 10,
    borderRadius: 4,
    fontSize: 10,
    color: '#FFFFFF',
  },
  activeStep: {
    backgroundColor: '#1E40AF',
  },
  inactiveStep: {
    backgroundColor: '#9CA3AF',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#6B7280',
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  statusBadge: {
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
  },
  submittedBadge: {
    backgroundColor: '#3B82F6',
  },
  confirmedBadge: {
    backgroundColor: '#10B981',
  },
  rejectedBadge: {
    backgroundColor: '#EF4444',
  },
});

interface BookingPDFProps {
  formData: any;
  campaignName: string;
  campaignDescription: string;
}

export const BookingPDF: React.FC<BookingPDFProps> = ({ formData, campaignName, campaignDescription }) => {
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

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return [styles.statusBadge, styles.submittedBadge];
      case 'confirmed':
        return [styles.statusBadge, styles.confirmedBadge];
      case 'rejected':
        return [styles.statusBadge, styles.rejectedBadge];
      default:
        return [styles.statusBadge, styles.submittedBadge];
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>MediaCo</Text>
            <Text style={styles.title}>Insertion Order</Text>
          </View>
          <View>
            <Text style={styles.reference}>{formData.campaignRef}</Text>
            <Text style={styles.tableCell}>Generated: {formatDate(new Date())}</Text>
            <View style={getStatusBadgeStyle('submitted')}>
              <Text>SUBMITTED</Text>
            </View>
          </View>
        </View>

        {/* Client Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Client Name</Text>
                <Text style={styles.tableCell}>{formData.clientName || 'Not specified'}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Contact Person</Text>
                <Text style={styles.tableCell}>{formData.contactName || 'Not specified'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Contact Email</Text>
                <Text style={styles.tableCell}>{formData.contactEmail || 'Not specified'}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Contact Phone</Text>
                <Text style={styles.tableCell}>{formData.contactPhone || 'Not specified'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Company Address</Text>
                <Text style={styles.tableCell}>{formData.address || 'Not specified'}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Industry Segment</Text>
                <Text style={styles.tableCell}>{formData.industrySegment || 'Not specified'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Tax Registration #</Text>
                <Text style={styles.tableCell}>{formData.taxRegistrationNo || 'Not specified'}</Text>
              </View>
              <View style={styles.tableCol}></View>
            </View>
          </View>
        </View>

        {/* Campaign Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Campaign Details</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Campaign Name</Text>
                <Text style={styles.tableCell}>{campaignName || 'Not specified'}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Campaign Reference ID</Text>
                <Text style={styles.tableCell}>{formData.campaignRef || 'Not specified'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Start Date</Text>
                <Text style={styles.tableCell}>{formatDate(formData.startDate)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>End Date</Text>
                <Text style={styles.tableCell}>{formatDate(formData.endDate)}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Creative Delivery Date</Text>
                <Text style={styles.tableCell}>{formatDate(formData.creativeDeliveryDate)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Media Type</Text>
                <Text style={styles.tableCell}>{formData.mediaType || 'Not specified'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Placement Preferences</Text>
                <Text style={styles.tableCell}>{formData.placementPreferences || 'Not specified'}</Text>
              </View>
              <View style={styles.tableCol}></View>
            </View>
          </View>
        </View>

        {/* Financial Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Details</Text>
          <View style={styles.financialTable}>
            <View style={styles.financialRow}>
              <View style={styles.financialLabel}>
                <Text style={styles.tableCellHeader}>Gross Amount</Text>
              </View>
              <View style={styles.financialValue}>
                <Text style={styles.tableCell}>{formatCurrency(formData.grossAmount || 0)}</Text>
              </View>
            </View>
            <View style={styles.financialRow}>
              <View style={styles.financialLabel}>
                <Text style={styles.tableCellHeader}>Partner Discount ({formData.partnerDiscount || 0}%)</Text>
              </View>
              <View style={styles.financialValue}>
                <Text style={styles.tableCell}>-{formatCurrency((formData.grossAmount * (formData.partnerDiscount || 0)) / 100)}</Text>
              </View>
            </View>
            <View style={styles.financialRow}>
              <View style={styles.financialLabel}>
                <Text style={styles.tableCellHeader}>Additional Charges</Text>
              </View>
              <View style={styles.financialValue}>
                <Text style={styles.tableCell}>{formatCurrency(formData.additionalCharges || 0)}</Text>
              </View>
            </View>
            <View style={[styles.financialRow, styles.netAmount]}>
              <View style={[styles.financialLabel, styles.netAmount]}>
                <Text style={styles.tableCellHeader}>Net Amount</Text>
              </View>
              <View style={[styles.financialValue, styles.netAmount]}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{formatCurrency(formData.netAmount || 0)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Creative & Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creative & Instructions</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Creative File Link</Text>
                <Text style={styles.tableCell}>{formData.creativeFileLink || 'Not provided'}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Creative Specs</Text>
                <Text style={styles.tableCell}>{formData.creativeSpecs || 'Not specified'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '100%' }]}>
                <Text style={styles.tableCellHeader}>Special Instructions</Text>
                <Text style={styles.tableCell}>{formData.specialInstructions || 'None'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Authorization Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authorization</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Signatory Name</Text>
                <Text style={styles.tableCell}>{formData.signatoryName || 'Not specified'}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Title</Text>
                <Text style={styles.tableCell}>{formData.signatoryTitle || 'Not specified'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Signature Date</Text>
                <Text style={styles.tableCell}>{formatDate(formData.signatureDate)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Signature</Text>
                <Text style={styles.tableCell}>Pending</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Booking Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Timeline</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressStep, styles.activeStep]}>
              <Text>Submitted</Text>
            </View>
            <View style={[styles.progressStep, styles.inactiveStep]}>
              <Text>PDF Generated</Text>
            </View>
            <View style={[styles.progressStep, styles.inactiveStep]}>
              <Text>Sent</Text>
            </View>
            <View style={[styles.progressStep, styles.inactiveStep]}>
              <Text>In Progress</Text>
            </View>
            <View style={[styles.progressStep, styles.inactiveStep]}>
              <Text>Confirmed</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>MediaCo – 123 Fictional Road, Singapore 000000</Text>
          <Text>Email: salesrep@mediaco.test | Website: www.mediaco.test</Text>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};
import { useState } from 'react';
import { Modal } from '../shared/Modal.jsx';
import { 
  SEVERITY_LEVELS, 
  ASSET_CRITICALITY_LEVELS, 
  DETECTION_SOURCES, 
  NIST_FAMILIES 
} from '../../utils/constants.js';

const INITIAL_FORM = {
  title: '',
  severity: '',
  assetCriticality: '',
  controlFamily: '',
  controlId: '',
  detectionSource: '',
  assetAffected: '',
  responsiblePOC: '',
  dateIdentified: '',
  scheduledCompletionDate: '',
  description: '',
  milestoneNotes: '',
  resourceEstimate: '',
  vendorDependency: false,
  status: 'Open' // Default for new
};

export const AddPOAMModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.severity) newErrors.severity = "Severity is required";
    if (!form.assetCriticality) newErrors.assetCriticality = "Asset Criticality is required";
    if (!form.controlFamily) newErrors.controlFamily = "Control Family is required";
    if (!form.controlId.trim()) newErrors.controlId = "Control ID is required";
    if (!form.detectionSource) newErrors.detectionSource = "Detection Source is required";
    if (!form.assetAffected.trim()) newErrors.assetAffected = "Asset Affected is required";
    if (!form.responsiblePOC.trim()) newErrors.responsiblePOC = "Responsible POC is required";
    if (!form.dateIdentified) newErrors.dateIdentified = "Date Identified is required";
    if (!form.scheduledCompletionDate) newErrors.scheduledCompletionDate = "Milestone Date is required";
    if (!form.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validate()) return;

    setIsSubmitting(true);
    
    // get controlFamilyName
    const familyName = NIST_FAMILIES[form.controlFamily] || '';
    
    const dataToSubmit = {
      ...form,
      controlFamilyName: familyName,
      originalMilestoneDate: form.scheduledCompletionDate,
      dateOfClosure: null
    };

    const result = onAdd(dataToSubmit);
    
    if (result.success) {
      setForm(INITIAL_FORM);
      onClose();
    } else {
      setSubmitError(result.error || "An error occurred");
    }
    
    setIsSubmitting(false);
  };

  // Reset form when closed if wanted, but simpler to just reset on success.
  // We can also reset when modal opens if needed.

  const inputClass = "mt-1 block w-full rounded-xl border border-border-soft px-3 py-2 text-sm focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary text-text-primary bg-white";
  const errorClass = "mt-1 text-xs text-red-600 font-medium";
  const labelClass = "block text-xs font-semibold text-text-secondary uppercase tracking-wider";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New POA&M" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {submitError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium border border-red-200">
            {submitError}
          </div>
        )}

        {/* Row 1: Title */}
        <div>
          <label className={labelClass}>Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            maxLength={80}
            className={inputClass}
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Short weakness name..."
          />
          {errors.title && <p className={errorClass}>{errors.title}</p>}
        </div>

        {/* Row 2: Severity | Asset Criticality */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Severity <span className="text-red-500">*</span></label>
            <select
              className={inputClass}
              value={form.severity}
              onChange={(e) => handleChange('severity', e.target.value)}
            >
              <option value="">Select Severity...</option>
              {SEVERITY_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.severity && <p className={errorClass}>{errors.severity}</p>}
          </div>
          <div>
            <label className={labelClass}>Asset Criticality <span className="text-red-500">*</span></label>
            <select
              className={inputClass}
              value={form.assetCriticality}
              onChange={(e) => handleChange('assetCriticality', e.target.value)}
            >
              <option value="">Select Criticality...</option>
              {ASSET_CRITICALITY_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.assetCriticality && <p className={errorClass}>{errors.assetCriticality}</p>}
          </div>
        </div>

        {/* Row 3: Control Family | Control ID */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Control Family <span className="text-red-500">*</span></label>
            <select
              className={inputClass}
              value={form.controlFamily}
              onChange={(e) => handleChange('controlFamily', e.target.value)}
            >
              <option value="">Select Family...</option>
              {Object.entries(NIST_FAMILIES).map(([code, name]) => (
                <option key={code} value={code}>{code} - {name}</option>
              ))}
            </select>
            {errors.controlFamily && <p className={errorClass}>{errors.controlFamily}</p>}
          </div>
          <div>
            <label className={labelClass}>Control ID <span className="text-red-500">*</span></label>
            <input
              type="text"
              maxLength={10}
              className={inputClass}
              value={form.controlId}
              onChange={(e) => handleChange('controlId', e.target.value)}
              placeholder="e.g. AC-17"
            />
            {errors.controlId && <p className={errorClass}>{errors.controlId}</p>}
          </div>
        </div>

        {/* Row 4: Detection Source */}
        <div>
          <label className={labelClass}>Detection Source <span className="text-red-500">*</span></label>
          <select
            className={inputClass}
            value={form.detectionSource}
            onChange={(e) => handleChange('detectionSource', e.target.value)}
          >
            <option value="">Select Source...</option>
            {DETECTION_SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          {errors.detectionSource && <p className={errorClass}>{errors.detectionSource}</p>}
        </div>

        {/* Row 5: Asset Affected */}
        <div>
          <label className={labelClass}>Asset Affected <span className="text-red-500">*</span></label>
          <input
            type="text"
            maxLength={100}
            className={inputClass}
            value={form.assetAffected}
            onChange={(e) => handleChange('assetAffected', e.target.value)}
            placeholder="System or component name"
          />
          {errors.assetAffected && <p className={errorClass}>{errors.assetAffected}</p>}
        </div>

        {/* Row 6: Responsible POC */}
        <div>
          <label className={labelClass}>Responsible POC <span className="text-red-500">*</span></label>
          <input
            type="text"
            maxLength={80}
            className={inputClass}
            value={form.responsiblePOC}
            onChange={(e) => handleChange('responsiblePOC', e.target.value)}
            placeholder="Full name"
          />
          {errors.responsiblePOC && <p className={errorClass}>{errors.responsiblePOC}</p>}
        </div>

        {/* Row 7: Date Identified | Milestone Date */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Date Identified <span className="text-red-500">*</span></label>
            <input
              type="date"
              className={inputClass}
              value={form.dateIdentified}
              onChange={(e) => handleChange('dateIdentified', e.target.value)}
            />
            {errors.dateIdentified && <p className={errorClass}>{errors.dateIdentified}</p>}
          </div>
          <div>
            <label className={labelClass}>Milestone Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              className={inputClass}
              value={form.scheduledCompletionDate}
              onChange={(e) => handleChange('scheduledCompletionDate', e.target.value)}
            />
            {errors.scheduledCompletionDate && <p className={errorClass}>{errors.scheduledCompletionDate}</p>}
          </div>
        </div>

        {/* Row 8: Description */}
        <div>
          <label className={labelClass}>Description <span className="text-red-500">*</span></label>
          <textarea
            rows={3}
            maxLength={500}
            className={inputClass}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Detailed explanation..."
          />
          {errors.description && <p className={errorClass}>{errors.description}</p>}
        </div>

        {/* Row 9: Milestone Notes */}
        <div>
          <label className={labelClass}>Milestone Notes</label>
          <textarea
            rows={2}
            maxLength={300}
            className={inputClass}
            value={form.milestoneNotes}
            onChange={(e) => handleChange('milestoneNotes', e.target.value)}
            placeholder="Progress notes (optional)..."
          />
        </div>

        {/* Row 10: Resource Estimate | Vendor Dependency */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 items-center">
          <div>
            <label className={labelClass}>Resource Estimate</label>
            <input
              type="text"
              className={inputClass}
              value={form.resourceEstimate}
              onChange={(e) => handleChange('resourceEstimate', e.target.value)}
              placeholder="e.g. 40 hours or $5,000"
            />
          </div>
          <div className="flex items-center pt-5">
            <input
              type="checkbox"
              id="vendorDependencyAdd"
              className="h-4 w-4 rounded border-gray-300 text-accent-primary focus:ring-accent-primary"
              checked={form.vendorDependency}
              onChange={(e) => handleChange('vendorDependency', e.target.checked)}
            />
            <label htmlFor="vendorDependencyAdd" className="ml-2 block text-sm text-text-primary">
              Has vendor dependency
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border-soft">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-primary border border-border-soft rounded-full hover:bg-bg-surface-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-accent-primary rounded-full hover:bg-accent-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add POA&M'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

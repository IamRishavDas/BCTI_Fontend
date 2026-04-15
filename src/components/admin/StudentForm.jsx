import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";
import { getTodayDate } from "../../utils/shared";
import { LockIcon } from "../../static/Svg";


function FieldWrapper({ label, hint, children, required = false }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 flex items-center gap-1"><LockIcon />{hint}</p>}
    </div>
  );
}

const inputBase = "w-full px-4 py-3 text-sm border rounded-2xl focus:outline-none transition-colors bg-white";
const inputNormal = inputBase + " border-gray-200 focus:border-blue-500 text-gray-800";
const inputDisabled = inputBase + " border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed";

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    rollNo: "",
    enrolledDate: "",
    currentSem: 1,
    courseId: "",
    password: "",

    fathersName: "",
    mothersName: "",
    spouseName: "",
    dob: "",
    religion: "",
    gender: "",           // Display string, but will convert to number on submit
    qualification: "",    // Display string, but will convert to number on submit
    address: "",
    pinCode: "",
    mobileNumber: "",
    enquirySource: "",
    governmentIdType: "", // Display string, but will convert to number on submit
    governmentIdNumber: "",
  });

  useEffect(() => {
    fetchCourses();
    if (isEdit) fetchStudentDetails();
  }, [id]);

  const fetchCourses = async () => {
    const res = await api.getCourseLookups(false);
    if (res.success) setCourses(res.data || []);
  };

  const fetchStudentDetails = async () => {
    setLoading(true);
    try {
      const res = await api.getStudentInfo(id);
      if (res.success && res.data) {
        const s = res.data;
        setForm({
          firstName: s.firstName || "",
          lastName: s.lastName || "",
          rollNo: s.rollNo || "",
          enrolledDate: s.enrolledDate ? s.enrolledDate.split("T")[0] : "",
          currentSem: s.currentSem || 1,
          courseId: s.courseId || "",

          fathersName: s.fathersName || "",
          mothersName: s.mothersName || "",
          spouseName: s.spouseName || "",
          dob: s.dob ? s.dob.split("T")[0] : "",
          religion: s.religion || "",
          gender: s.gender || "",                    // e.g. "MALE"
          qualification: s.qualification || "",      // e.g. "GRADUATION"
          address: s.address || "",
          pinCode: s.pinCode ? String(s.pinCode) : "",
          mobileNumber: s.mobileNumber || "",
          enquirySource: s.enquirySource || "",
          governmentIdType: s.governmentIdType || "", // e.g. "ADHAR"
          governmentIdNumber: s.governmentIdNumber || "",
          password: "",
        });
      }
    } catch (err) {
      showError("Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  // Convert display strings to numbers + empty strings to null
  const preparePayload = (data) => {
    const payload = { ...data };

    // Gender mapping
    const genderMap = { "MALE": 1, "FEMALE": 2, "OTHERS": 3 };
    payload.gender = data.gender ? genderMap[data.gender] || null : null;

    // Qualification mapping
    const qualMap = {
      "SECONDARY": 1,
      "HS": 2,
      "GRADUATION": 3,
      "MASTERS": 4,
      "POST_GRADUATION": 5
    };
    payload.qualification = data.qualification ? qualMap[data.qualification] || null : null;

    // Government ID Type mapping
    const idTypeMap = { "ADHAR": 1, "VOTER": 2, "PAN": 3, "RATION": 4 };
    payload.governmentIdType = data.governmentIdType ? idTypeMap[data.governmentIdType] || null : null;

    // PinCode as number or null
    payload.pinCode = data.pinCode ? parseInt(data.pinCode) : null;

    // Convert empty strings to null for optional fields
    const optionalFields = [
      'fathersName', 'mothersName', 'spouseName', 'religion',
      'address', 'mobileNumber', 'enquirySource', 'governmentIdNumber'
    ];

    optionalFields.forEach(field => {
      if (payload[field] === "" || payload[field] == null) {
        payload[field] = null;
      }
    });

    // Remove fields not allowed during update
    if (isEdit) {
      delete payload.rollNo;
      delete payload.enrolledDate;
      delete payload.password;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = preparePayload(form);

    if (isEdit) {
      const res = await api.updateStudent(id, payload);
      if (res.success) {
        showSuccess("Student updated successfully");
        navigate("/admin/students");
      } else {
        showError(res.message || res.Message || "Failed to update student");
      }
    } else {
      const res = await api.createStudent(payload);
      if (res.success) {
        showSuccess("Student created successfully");
        navigate("/admin/students");
      } else {
        showError(res.message || res.Message || "Failed to create student");
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow p-10"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            {isEdit ? "Edit Student" : "Add New Student"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isEdit ? "Update student personal details" : "Fill all required fields"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info - unchanged */}
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="First Name" required>
              <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputNormal} required />
            </FieldWrapper>
            <FieldWrapper label="Last Name" required>
              <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputNormal} required />
            </FieldWrapper>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Roll Number" hint={isEdit ? "Cannot be changed" : null} required={!isEdit}>
              <input type="text" value={form.rollNo} onChange={(e) => !isEdit && setForm({ ...form, rollNo: e.target.value })} disabled={isEdit} className={isEdit ? inputDisabled : inputNormal} required={!isEdit} />
            </FieldWrapper>

            <FieldWrapper label="Enrolled Date" hint={isEdit ? "Cannot be changed" : null} required={!isEdit}>
              <input type="date" value={form.enrolledDate} onChange={(e) => !isEdit && setForm({ ...form, enrolledDate: e.target.value })} disabled={isEdit} className={isEdit ? inputDisabled : inputNormal} max={getTodayDate()} required={!isEdit} />
            </FieldWrapper>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Current Semester" required>
              <input type="number" value={form.currentSem} onChange={(e) => setForm({ ...form, currentSem: parseInt(e.target.value) || 1 })} className={inputNormal} min="1" max="20" required />
            </FieldWrapper>

            <FieldWrapper label="Course" required>
              <select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} className={inputNormal} required>
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.courseId} value={c.courseId}>
                    {c.courseName} ({c.courseCode})
                  </option>
                ))}
              </select>
            </FieldWrapper>
          </div>

          {!isEdit && (
            <FieldWrapper label="Password">
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputNormal} placeholder="Default: Student@1234" />
            </FieldWrapper>
          )}

          {/* Personal Details */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-5">Personal Information</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <FieldWrapper label="Father's Name">
                <input type="text" value={form.fathersName} onChange={(e) => setForm({ ...form, fathersName: e.target.value })} className={inputNormal} />
              </FieldWrapper>
              <FieldWrapper label="Mother's Name">
                <input type="text" value={form.mothersName} onChange={(e) => setForm({ ...form, mothersName: e.target.value })} className={inputNormal} />
              </FieldWrapper>
            </div>

            <FieldWrapper label="Spouse Name (if married)">
              <input type="text" value={form.spouseName} onChange={(e) => setForm({ ...form, spouseName: e.target.value })} className={inputNormal} />
            </FieldWrapper>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <FieldWrapper label="Date of Birth">
                <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className={inputNormal} />
              </FieldWrapper>

              <FieldWrapper label="Gender" required>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputNormal} required>
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHERS">Others</option>
                </select>
              </FieldWrapper>
            </div>

            <div className="mb-6 mt-6">
              <FieldWrapper label="Religion">
                <input type="text" value={form.religion} onChange={(e) => setForm({ ...form, religion: e.target.value })} className={inputNormal} />
              </FieldWrapper>
            </div>

            <FieldWrapper label="Highest Qualification" required>
              <select value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className={inputNormal} required>
                <option value="">Select Qualification</option>
                <option value="SECONDARY">Secondary</option>
                <option value="HS">Higher Secondary</option>
                <option value="GRADUATION">Graduation</option>
                <option value="MASTERS">Masters</option>
                <option value="POST_GRADUATION">Post Graduation</option>
              </select>
            </FieldWrapper>

            <div className="mt-6 mb-6">
              <FieldWrapper label="Full Address">
                <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputNormal + " min-h-[80px] resize-y"} placeholder="House no, street, city..." />
              </FieldWrapper>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <FieldWrapper label="Pin Code">
                <input type="number" value={form.pinCode} onChange={(e) => setForm({ ...form, pinCode: e.target.value })} className={inputNormal} />
              </FieldWrapper>
              <FieldWrapper label="Mobile Number">
                <input type="tel" maxLength={10} value={form.mobileNumber} onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} className={inputNormal} placeholder="9876543210" />
              </FieldWrapper>
            </div>

            <FieldWrapper label="Enquiry Source">
              <input type="text" value={form.enquirySource} onChange={(e) => setForm({ ...form, enquirySource: e.target.value })} className={inputNormal} />
            </FieldWrapper>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <FieldWrapper label="Government ID Type">
                <select value={form.governmentIdType} onChange={(e) => setForm({ ...form, governmentIdType: e.target.value })} className={inputNormal}>
                  <option value="">Select ID Type</option>
                  <option value="ADHAR">Aadhaar</option>
                  <option value="VOTER">Voter ID</option>
                  <option value="PAN">PAN Card</option>
                  <option value="RATION">Ration Card</option>
                </select>
              </FieldWrapper>

              <FieldWrapper label="Government ID Number">
                <input type="text" value={form.governmentIdNumber} onChange={(e) => setForm({ ...form, governmentIdNumber: e.target.value })} className={inputNormal} />
              </FieldWrapper>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button type="button" onClick={() => navigate("/admin/students")} className="flex-1 py-3.5 text-sm font-medium border border-gray-200 rounded-2xl hover:bg-gray-50 cursor-pointer">
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-2xl cursor-pointer"
            >
              {loading ? "Saving..." : isEdit ? "Update Student" : "Create Student"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
import { departmentsStorage } from "../config/storage.js";

export const createDepartment = async (req, res) => {
  try {
    let { departmentCode, departmentName, grossSalary } = req.body;
    const userId = req.userId;

    if (!departmentCode || !departmentName || grossSalary == null) {
      return res.status(400).json({ message: "Please fill in all required fields: Department Code, Department Name, and Base Gross Salary." });
    }

    grossSalary = Number(grossSalary);
    if (isNaN(grossSalary) || grossSalary < 0) {
      return res.status(400).json({ message: "Base Gross Salary must be a valid positive number." });
    }

    // Check if department already exists
    const existingDept = departmentsStorage.findOne(d => d.departmentCode === departmentCode);
    if (existingDept) {
      return res.status(409).json({ message: "A department with this code already exists. Please use a different code." });
    }

    const newDept = departmentsStorage.insert({
      departmentCode,
      departmentName,
      grossSalary,
      userId
    });

    return res.status(201).json({
      message: "Department created successfully.",
      department: newDept
    });
  } catch (error) {
    console.error("Create Department error:", error.message);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const userId = req.userId;
    // Logic: fetch departments belonging to user or global
    const departments = departmentsStorage.find(d => !d.userId || d.userId === userId);

    return res.status(200).json({
      message: "Departments list retrieved successfully.",
      departments
    });
  } catch (error) {
    console.error("Get Departments error:", error.message);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { departmentCode } = req.params;
    const userId = req.userId;

    if (!departmentCode) {
      return res.status(400).json({ message: "Department code is required to delete a department." });
    }

    const success = departmentsStorage.delete(d => d.departmentCode === departmentCode && (!d.userId || d.userId === userId));

    if (success) {
      return res.status(200).json({ message: "Department deleted successfully." });
    } else {
      return res.status(404).json({ message: "Department not found or you don't have permission to delete it." });
    }
  } catch (error) {
    console.error("Delete Department error:", error.message);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};

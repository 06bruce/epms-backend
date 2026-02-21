import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";

export const createSalary = async (req, res) => {
  try {
    let { employeeNumber, month, deductions } = req.body;
    const userId = req.userId;

    if (!employeeNumber || !month) {
      return res.status(400).json({ message: "Please select an employee and a month to create a salary record." });
    }

    const empNum = Number(employeeNumber);

    // Find employee
    const employee = await Employee.findOne({
      where: {
        employeeNumber: empNum,
        [Employee.sequelize.Sequelize.Op.or]: [{ userId: null }, { userId }]
      }
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found. Please check the employee number and try again." });
    }

    // Find department for gross salary
    const department = await Department.findOne({
      where: { departmentCode: employee.departmentCode }
    });

    if (!department) {
      return res.status(404).json({ message: "Department information not found. Please ensure the employee's department exists." });
    }

    // Check if salary record already exists
    const existingSalary = await Salary.findOne({
      where: { employeeNumber: empNum, month }
    });

    if (existingSalary) {
      return res.status(409).json({ message: "A salary record for this employee and month already exists." });
    }

    const grossSalaryNum = Number(department.grossSalary);
    const deductionsNum = deductions ? Number(deductions) : 0;
    const netSalary = grossSalaryNum - deductionsNum;

    const newSalary = await Salary.create({
      employeeNumber: empNum,
      month,
      grossSalary: grossSalaryNum,
      deductions: deductionsNum,
      netSalary,
      userId
    });

    console.log(`✅ Salary record created in DB: Employee #${empNum} for ${month}`);

    return res.status(201).json({
      message: "Salary record created successfully.",
      salary: newSalary
    });

  } catch (error) {
    console.error("Create Salary error:", error.message);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};

export const getSalary = async (req, res) => {
  try {
    const userId = req.userId;
    const salaries = await Salary.findAll({
      where: {
        [Salary.sequelize.Sequelize.Op.or]: [{ userId: null }, { userId }]
      }
    });

    console.log(`🔍 Fetched ${salaries.length} salary records from DB`);

    // Enrich with employee details for the frontend
    const enrichedSalaries = await Promise.all(salaries.map(async (s) => {
      const emp = await Employee.findOne({ where: { employeeNumber: s.employeeNumber } });
      return {
        ...s.toJSON(),
        salaryId: s.id,
        firstName: emp ? emp.firstName : 'Unknown',
        lastName: emp ? emp.lastName : '',
        position: emp ? emp.position : 'N/A'
      };
    }));

    return res.status(200).json({
      message: "Salary records retrieved successfully.",
      salary: enrichedSalaries
    });
  } catch (error) {
    console.error("Get Salary error:", error.message);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};

export const getSalaryByEmployee = async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    const userId = req.userId;

    if (!employeeNumber) {
      return res.status(400).json({ message: "Employee number is required to fetch salary records." });
    }

    const empNum = Number(employeeNumber);
    const salaries = await Salary.findAll({
      where: {
        employeeNumber: empNum,
        [Salary.sequelize.Sequelize.Op.or]: [{ userId: null }, { userId }]
      }
    });

    const enrichedSalaries = await Promise.all(salaries.map(async (s) => {
      const emp = await Employee.findOne({ where: { employeeNumber: s.employeeNumber } });
      return {
        ...s.toJSON(),
        salaryId: s.id,
        firstName: emp ? emp.firstName : 'Unknown',
        lastName: emp ? emp.lastName : '',
        position: emp ? emp.position : 'N/A'
      };
    }));

    return res.status(200).json({
      message: enrichedSalaries.length > 0 ? "Salary records retrieved successfully." : "No salary records found for this employee.",
      salary: enrichedSalaries
    });
  } catch (error) {
    console.error("Get Salary By Employee error:", error.message);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};

export const deleteSalary = async (req, res) => {
  try {
    const { salaryId } = req.params;
    const userId = req.userId;

    if (!salaryId) {
      return res.status(400).json({ message: "Salary ID is required to delete a salary record." });
    }

    const deleted = await Salary.destroy({
      where: {
        id: salaryId,
        [Salary.sequelize.Sequelize.Op.or]: [{ userId: null }, { userId }]
      }
    });

    if (deleted) {
      return res.status(200).json({ message: "Salary record deleted successfully." });
    } else {
      return res.status(404).json({ message: "Salary record not found or you don't have permission to delete it." });
    }
  } catch (error) {
    console.error("Delete Salary error:", error.message);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};

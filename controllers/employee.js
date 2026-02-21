import Employee from "../models/Employee.js";

export const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, address, gender, position, departmentCode } = req.body;
    const userId = req.userId;

    if (!firstName || !lastName || !gender || !position || !departmentCode) {
      return res.status(400).json({ message: "Please fill in all required fields: First Name, Last Name, Gender, Position, and Department." });
    }

    // Get next employee number
    const maxEmp = await Employee.max('employeeNumber');
    const employeeNumber = (maxEmp || 0) + 1;

    const newEmployee = await Employee.create({
      employeeNumber,
      firstName,
      lastName,
      gender,
      address,
      position,
      departmentCode,
      userId
    });

    console.log(`✅ Employee created in DB: ${newEmployee.firstName} ${newEmployee.lastName} (#${newEmployee.employeeNumber})`);

    return res.status(201).json({
      message: "Employee created successfully.",
      employee: newEmployee
    });

  } catch (error) {
    console.error("Create Employee error:", error.message);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const userId = req.userId;
    const employees = await Employee.findAll({
      where: {
        [Employee.sequelize.Sequelize.Op.or]: [{ userId: null }, { userId }]
      }
    });

    console.log(`🔍 Fetched ${employees.length} employees from DB`);

    return res.status(200).json({
      message: "Employee list retrieved successfully.",
      employee: employees
    });
  } catch (error) {
    console.error("Get Employee error:", error.message);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    const userId = req.userId;

    if (!employeeNumber) {
      return res.status(400).json({ message: "Employee number is required to delete an employee." });
    }

    const empNum = Number(employeeNumber);
    const deleted = await Employee.destroy({
      where: {
        employeeNumber: empNum,
        [Employee.sequelize.Sequelize.Op.or]: [{ userId: null }, { userId }]
      }
    });

    if (deleted) {
      return res.status(200).json({ message: "Employee deleted successfully." });
    } else {
      return res.status(404).json({ message: "Employee not found or you don't have permission to delete it." });
    }
  } catch (error) {
    console.error("Delete Employee error:", error.message);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};

export const messages = {
    record_delete: "Record Deleted",
    record_add: "Record Added",
    record_update: "Record Updated",
    record_saved: "Record Saved",
    record_notexist: "Record not found",
    record_already_exist: "Record already exists",
    record_closed: "Record closed",
}

export const error_msg = {
    general_err: "An error has occurred. ",
    required: "cannot be null or empty",
    not_username_pwd: "Invalid username or password",
    token_required: "Token required",
    token_expired: "Token expired",
    unauthorize: "Unauthorized",
    in_used: "Cannot delete, current record is in used.",
    id_require: "Missing ID",
    not_found: " not found."
}

export const leave_msg = {
    attendance_not_found: "Attendance not found for ",
    attendance_save: "Attendance records saved for ",
    attendance_must_be_array: "Attendance records must be an array",
    leave_policy_not_define: "Leave policy not defined. Please set a leave policy first.",
    leave_policy_not_updated: "Cannot update leave policy. Passed data is invalid.",
    leave_record_not_generated: "Cannot generate leave records for the year ",
    leave_record_already_exist: "There is already a record for the year for ",
    leave_record_not_found: "Leave record not found for ",
    no_employee_match_leave_record: "No employee's employment period matches the year.",
    qty_err: "Asset quantity is smaller than current quantity.",
    leave_requested: "Leave requested.",
    leave_request_updated: "Leave request updated"
}

export const file_err_msg = {
    notExist: "File not Exist",
    notFileType: "Wrong file type url",
}

const allmessages = {
    file_err_msg,
    leave_msg,
    error_msg,
    messages,
};

export default allmessages;
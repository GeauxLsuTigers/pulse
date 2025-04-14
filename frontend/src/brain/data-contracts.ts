/** Body_upload_csv */
export interface BodyUploadCsv {
  /**
   * File
   * @format binary
   */
  file: File;
}

/** Body_validate_csv */
export interface BodyValidateCsv {
  /**
   * File
   * @format binary
   */
  file: File;
}

/** CSVUploadResponse */
export interface CSVUploadResponse {
  /** Success */
  success: boolean;
  /** Total */
  total: number;
  /** Imported */
  imported: number;
  /** Errors */
  errors?: Record<string, any>[];
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** MessageGenerate */
export interface MessageGenerate {
  /** Prospectid */
  prospectId: string;
  /** Templateid */
  templateId?: string | null;
  /** Messagetype */
  messageType: string;
  /** Customprompt */
  customPrompt?: string | null;
  /** Prospectdata */
  prospectData?: Record<string, any> | null;
  /** Userdata */
  userData?: Record<string, any> | null;
}

/** MessageResponse */
export interface MessageResponse {
  /** Message */
  message: string;
  /** Variables */
  variables?: Record<string, string>;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type UploadCsvData = CSVUploadResponse;

export type UploadCsvError = HTTPValidationError;

/** Response Generate Sample Data */
export type GenerateSampleDataData = Record<string, any>;

export type ValidateCsvData = any;

export type ValidateCsvError = HTTPValidationError;

export type GenerateMessageData = MessageResponse;

export type GenerateMessageError = HTTPValidationError;

/** Response Get Default Templates */
export type GetDefaultTemplatesData = Record<string, string>;

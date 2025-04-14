import {
  BodyUploadCsv,
  BodyValidateCsv,
  CheckHealthData,
  GenerateMessageData,
  GenerateSampleDataData,
  GetDefaultTemplatesData,
  MessageGenerate,
  UploadCsvData,
  ValidateCsvData,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * No description
   * @tags dbtn/module:prospects, dbtn/hasAuth
   * @name upload_csv
   * @summary Upload Csv
   * @request POST:/routes/prospects/upload-csv
   */
  export namespace upload_csv {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyUploadCsv;
    export type RequestHeaders = {};
    export type ResponseBody = UploadCsvData;
  }

  /**
   * @description Generate sample prospect data for testing
   * @tags dbtn/module:prospects, dbtn/hasAuth
   * @name generate_sample_data
   * @summary Generate Sample Data
   * @request POST:/routes/prospects/generate-sample-data
   */
  export namespace generate_sample_data {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GenerateSampleDataData;
  }

  /**
   * No description
   * @tags dbtn/module:prospects, dbtn/hasAuth
   * @name validate_csv
   * @summary Validate Csv
   * @request POST:/routes/prospects/validate-csv
   */
  export namespace validate_csv {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyValidateCsv;
    export type RequestHeaders = {};
    export type ResponseBody = ValidateCsvData;
  }

  /**
   * @description Generate a personalized message for a prospect
   * @tags dbtn/module:messages, dbtn/hasAuth
   * @name generate_message
   * @summary Generate Message
   * @request POST:/routes/messages/generate
   */
  export namespace generate_message {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MessageGenerate;
    export type RequestHeaders = {};
    export type ResponseBody = GenerateMessageData;
  }

  /**
   * @description Get default message templates
   * @tags dbtn/module:messages, dbtn/hasAuth
   * @name get_default_templates
   * @summary Get Default Templates
   * @request GET:/routes/messages/templates
   */
  export namespace get_default_templates {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetDefaultTemplatesData;
  }
}

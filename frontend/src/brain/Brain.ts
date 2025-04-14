import {
  BodyUploadCsv,
  BodyValidateCsv,
  CheckHealthData,
  GenerateMessageData,
  GenerateMessageError,
  GenerateSampleDataData,
  GetDefaultTemplatesData,
  MessageGenerate,
  UploadCsvData,
  UploadCsvError,
  ValidateCsvData,
  ValidateCsvError,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:prospects, dbtn/hasAuth
   * @name upload_csv
   * @summary Upload Csv
   * @request POST:/routes/prospects/upload-csv
   */
  upload_csv = (data: BodyUploadCsv, params: RequestParams = {}) =>
    this.request<UploadCsvData, UploadCsvError>({
      path: `/routes/prospects/upload-csv`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });

  /**
   * @description Generate sample prospect data for testing
   *
   * @tags dbtn/module:prospects, dbtn/hasAuth
   * @name generate_sample_data
   * @summary Generate Sample Data
   * @request POST:/routes/prospects/generate-sample-data
   */
  generate_sample_data = (params: RequestParams = {}) =>
    this.request<GenerateSampleDataData, any>({
      path: `/routes/prospects/generate-sample-data`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:prospects, dbtn/hasAuth
   * @name validate_csv
   * @summary Validate Csv
   * @request POST:/routes/prospects/validate-csv
   */
  validate_csv = (data: BodyValidateCsv, params: RequestParams = {}) =>
    this.request<ValidateCsvData, ValidateCsvError>({
      path: `/routes/prospects/validate-csv`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });

  /**
   * @description Generate a personalized message for a prospect
   *
   * @tags dbtn/module:messages, dbtn/hasAuth
   * @name generate_message
   * @summary Generate Message
   * @request POST:/routes/messages/generate
   */
  generate_message = (data: MessageGenerate, params: RequestParams = {}) =>
    this.request<GenerateMessageData, GenerateMessageError>({
      path: `/routes/messages/generate`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get default message templates
   *
   * @tags dbtn/module:messages, dbtn/hasAuth
   * @name get_default_templates
   * @summary Get Default Templates
   * @request GET:/routes/messages/templates
   */
  get_default_templates = (params: RequestParams = {}) =>
    this.request<GetDefaultTemplatesData, any>({
      path: `/routes/messages/templates`,
      method: "GET",
      ...params,
    });
}

import { Logger } from '@nestjs/common';
import * as commonmark from 'commonmark';
import { promises as fs } from 'fs';
import { Mandrill } from 'mandrill-api/mandrill';

const TEMPLATE_DIR = `${__dirname}/../../templates`;
const GOOGLE_IMAGE_URL = `https://storage.googleapis.com/${process.env.GOOGLE_STORAGE_PUBLIC_BUCKET}`;

export type MandrillResponse = {
  email: string;
  status: string;
  reject_reason: string | null;
};

export async function sendMail(
  // Company data used in email template
  company: {
    name: string;
    email: string | null;
    phoneNumber: string | null;
  },
  // Email metadata
  email: {
    fromName: string,
    fromEmail: string,
    to: {
      name: string,
      email: string
    }[],
    subject: string,
    fields?: {},
    templateFile?: string, // Markdown template file name loaded from file system
    templateString?: string, // Markdown template as string parameter
    language?: string,
    attachments?: any[],
  }
): Promise<MandrillResponse> {
  const client = new Mandrill(process.env.MANDRILL_API_KEY);
  const reader = new commonmark.Parser();
  const writer = new commonmark.HtmlRenderer();


  // **********************
  // Generate email content
  // **********************
  let htmlTemplate: string;
  let markdownTemplate: string = '';

  /* tslint:disable:quotemark */

  // Read the HTML template file
  const htmlFilename = `${TEMPLATE_DIR}/email_template.html`;
  try {
    htmlTemplate = (await fs.readFile(htmlFilename)).toLocaleString();
  } catch (e) {
    htmlTemplate = '<!--CONTENT-->';
  }

  // Get markdown template from file or from string parameter
  if (email.templateFile) {
    const filename = `${TEMPLATE_DIR}/${(email.language || 'fi')}/${email.templateFile}`;
    try {
      markdownTemplate += (await fs.readFile(filename)).toLocaleString();
    } catch (e) {
      Logger.warn(`Could not open ${filename}, falling back to english version`);
      markdownTemplate += (await fs.readFile(`${TEMPLATE_DIR}/en/${email.templateFile}`)).toLocaleString();
    }
  } else if (email.templateString) {
    markdownTemplate += email.templateString;
  } else {
    throw new Error('no email template');
  }

  // Replace ___[FIELD]___ placeholders in markdown template data
  if (email.fields) {
    Object.keys(email.fields).forEach(key => {
      let templateData = '';
      switch (true) {
        case key === 'URL':
          templateData = `[${email.fields['URL_TEXT']}](${email.fields['URL']})`;
          break;

        case key === 'BOOKING_URL':
          templateData = `[${email.fields['BOOKING_URL_TEXT']}](${email.fields['BOOKING_URL']})`;
          break;

        case key === 'CANCEL_URL':
          templateData = `[${email.fields['CANCEL_URL_TEXT']}](${email.fields['CANCEL_URL']})`;
          break;

        case key === 'BOOKING_TERMS_URL':
          templateData = `[${email.fields['BOOKING_TERMS_URL_TEXT']}](${email.fields['BOOKING_TERMS_URL']})`;
          break;

        default:
          templateData = email.fields[key];
          break;
      }
      markdownTemplate = markdownTemplate.replace(`___${key}___`, templateData !== null ? templateData : "-");
    });
  }
  // Remove existing empty template params
  markdownTemplate = markdownTemplate.replace(/___[^ ]+___/g, '');

  /* tslint:enable:quotemark */

  // Generate email HTML content
  const content = reader.parse(markdownTemplate);
  let html = htmlTemplate.replace('<!--CONTENT-->', writer.render(content));

  // Restrict all image heights to 256px
  html = html.replace(/<img/g, '<img style="max-height: 256px; height: auto; width: auto;"');

  // *************
  // Email sending
  // *************
  const message = {
    subject: email.subject,
    html,
    to: email.to.map(to => ({ ...to, type: 'to' })),
    from_name: email.fromName,
    from_email: email.fromEmail,
    attachments: email.attachments || [],
  };

  return new Promise((resolve, reject) => {
    client.messages.send({ message, async: true }, (res) => {
      Logger.debug(res);
      resolve(res);
    }, (err) => {
      Logger.debug(err);
      reject(err);
    });
  });
}

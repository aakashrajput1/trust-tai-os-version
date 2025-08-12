// Email Service Utility
// This file provides a unified interface for sending emails
// You can easily switch between different email providers

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}

export interface EmailService {
  send(data: EmailData): Promise<void>
}

// Mock email service for development
export class MockEmailService implements EmailService {
  async send(data: EmailData): Promise<void> {
    console.log('=== MOCK EMAIL SERVICE ===')
    console.log('To:', data.to)
    console.log('Subject:', data.subject)
    console.log('From:', data.from || 'noreply@company.com')
    console.log('HTML Content:', data.html)
    console.log('=== END EMAIL ===')
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In development, you might want to save emails to a file or database
    // for testing purposes
  }
}

// SendGrid implementation (example)
export class SendGridEmailService implements EmailService {
  private apiKey: string
  
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }
  
  async send(data: EmailData): Promise<void> {
    // Implementation for SendGrid
    // You would need to install @sendgrid/mail package
    /*
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(this.apiKey)
    
    const msg = {
      to: data.to,
      from: data.from || 'noreply@company.com',
      subject: data.subject,
      html: data.html,
      text: data.text || this.htmlToText(data.html)
    }
    
    await sgMail.send(msg)
    */
    
    throw new Error('SendGrid implementation not available. Please install @sendgrid/mail package.')
  }
  
  private htmlToText(html: string): string {
    // Simple HTML to text conversion
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }
}

// AWS SES implementation (example)
export class AWSSESEmailService implements EmailService {
  private region: string
  private accessKeyId: string
  private secretAccessKey: string
  
  constructor(region: string, accessKeyId: string, secretAccessKey: string) {
    this.region = region
    this.accessKeyId = accessKeyId
    this.secretAccessKey = secretAccessKey
  }
  
  async send(data: EmailData): Promise<void> {
    // Implementation for AWS SES
    // You would need to install @aws-sdk/client-ses package
    /*
    const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
    
    const client = new SESClient({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey
      }
    })
    
    const command = new SendEmailCommand({
      Source: data.from || 'noreply@company.com',
      Destination: {
        ToAddresses: [data.to]
      },
      Message: {
        Subject: {
          Data: data.subject
        },
        Body: {
          Html: {
            Data: data.html
          },
          Text: {
            Data: data.text || this.htmlToText(data.html)
          }
        }
      }
    })
    
    await client.send(command)
    */
    
    throw new Error('AWS SES implementation not available. Please install @aws-sdk/client-ses package.')
  }
  
  private htmlToText(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }
}

// Nodemailer implementation (example)
export class NodemailerEmailService implements EmailService {
  private transporter: any
  
  constructor(smtpConfig: any) {
    // You would need to install nodemailer package
    /*
    const nodemailer = require('nodemailer')
    this.transporter = nodemailer.createTransporter(smtpConfig)
    */
    
    throw new Error('Nodemailer implementation not available. Please install nodemailer package.')
  }
  
  async send(data: EmailData): Promise<void> {
    /*
    await this.transporter.sendMail({
      from: data.from || 'noreply@company.com',
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text || this.htmlToText(data.html)
    })
    */
    
    throw new Error('Nodemailer implementation not available. Please install nodemailer package.')
  }
  
  private htmlToText(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }
}

// Factory function to get the appropriate email service
export function getEmailService(): EmailService {
  const emailProvider = process.env.EMAIL_PROVIDER || 'mock'
  
  switch (emailProvider.toLowerCase()) {
    case 'sendgrid':
      const sendgridApiKey = process.env.SENDGRID_API_KEY
      if (!sendgridApiKey) {
        console.warn('SENDGRID_API_KEY not found, falling back to mock service')
        return new MockEmailService()
      }
      return new SendGridEmailService(sendgridApiKey)
      
    case 'aws-ses':
      const awsRegion = process.env.AWS_REGION
      const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
      const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
      
      if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey) {
        console.warn('AWS credentials not found, falling back to mock service')
        return new MockEmailService()
      }
      return new AWSSESEmailService(awsRegion, awsAccessKeyId, awsSecretAccessKey)
      
    case 'nodemailer':
      const smtpConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      }
      
      if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
        console.warn('SMTP configuration not found, falling back to mock service')
        return new MockEmailService()
      }
      return new NodemailerEmailService(smtpConfig)
      
    case 'mock':
    default:
      return new MockEmailService()
  }
}

// Helper function to send emails
export async function sendEmail(data: EmailData): Promise<void> {
  const emailService = getEmailService()
  await emailService.send(data)
}

import * as React from 'react'

interface EmailTemplateProps {
  email: string
  verificationCode: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,
  verificationCode,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px', lineHeight: '1.6' }}>
    <h1
      style={{
        background: 'rgb(52, 52, 234)',
        color: '#ddd',
        padding: '10px 0',
        textAlign: 'center',
      }}
    >
      This email is sent to {email}
    </h1>
    <h2>Verification code:</h2>
    <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', margin: '10px' }}>
      <span
        style={{
          display: 'inline-block',
          backgroundColor: '#f1f3f5',
          padding: '5px 15px',
          borderRadius: '8px',
        }}
      >
        {verificationCode}
      </span>
    </div>
    <span style={{ fontSize: '12px', color: '#6c757d' }}>
      Please use this code to change your password.
    </span>
  </div>
)

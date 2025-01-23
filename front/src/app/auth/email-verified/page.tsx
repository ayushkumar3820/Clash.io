import Link from 'next/link';

export default function EmailVerified() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Email Verified Successfully!</h1>
      <p>Your email has been verified. You can now login to your account.</p>
      <a 
        href="/login" 
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to Login
      </a>
    </div>
  );
} 
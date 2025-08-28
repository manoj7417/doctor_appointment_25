"use client";

import { useState } from "react";

export default function TestPhone() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("Test SMS from your app");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testSms = async () => {
    if (!phone) {
      alert("Please enter a phone number");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          message: message,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkConfig = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-sms");
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Phone Number & SMS Test</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Phone Number (try different formats):
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g., 9876543210, +919876543210, 09876543210"
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-600 mt-1">
            Try: 9876543210, +919876543210, 09876543210, 919876543210
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={testSms}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Test SMS"}
          </button>

          <button
            onClick={checkConfig}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Check Config
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 border rounded">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800 mb-2">Debugging Tips:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>
            • Check the browser console for detailed phone formatting logs
          </li>
          <li>• Look for "📱 Phone Number Formatting Debug" messages</li>
          <li>• Verify your BulkSMS API credentials are set in .env</li>
          <li>• Check if your BulkSMS account has sufficient balance</li>
          <li>• Ensure your sender ID is approved by BulkSMS</li>
        </ul>
      </div>
    </div>
  );
}

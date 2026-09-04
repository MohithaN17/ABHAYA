import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  final Function(String phone, String caseId) onLoginSuccess;
  const LoginScreen({super.key, required this.onLoginSuccess});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneController = TextEditingController();
  final _caseIdController = TextEditingController();
  final _otpController = TextEditingController();
  bool _otpSent = false;

  void _handleSendOtp() {
    if (_phoneController.text.isNotEmpty && _caseIdController.text.isNotEmpty) {
      setState(() => _otpSent = true);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('OTP sent to registered phone number: 123456')),
      );
    }
  }

  void _handleVerify() {
    if (_otpController.text == "123456" || _otpController.text.isNotEmpty) {
      widget.onLoginSuccess(_phoneController.text, _caseIdController.text);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Invalid OTP. Use 123456 for demo')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FC),
      appBar: AppBar(
        title: const Text('ABHAYA - Victim Portal'),
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Card(
            elevation: 4,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Icon(Icons.shield_outlined, size: 60, color: Color(0xFF1E3A8A)),
                  const SizedBox(height: 12),
                  const Text(
                    'Confidential Support Login',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),
                  TextField(
                    controller: _caseIdController,
                    decoration: const InputDecoration(
                      labelText: 'Case ID (e.g. KA-2026-BLR-001)',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.folder_shared),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    decoration: const InputDecoration(
                      labelText: 'Registered Mobile Number',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.phone),
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (_otpSent) ...[
                    TextField(
                      controller: _otpController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Enter 6-Digit OTP',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.lock_clock),
                      ),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E3A8A),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      onPressed: _handleVerify,
                      child: const Text('Verify & Login', style: TextStyle(color: Colors.white)),
                    ),
                  ] else ...[
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E3A8A),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      onPressed: _handleSendOtp,
                      child: const Text('Send Verification OTP', style: TextStyle(color: Colors.white)),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
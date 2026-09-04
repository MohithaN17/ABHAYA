import 'package:flutter/material.dart';
import 'screens/auth/login_screen.dart';
import 'screens/checkin/checkin_screen.dart';
import 'screens/assistance_screen.dart';

void main() {
  runApp(const AbhayaVictimApp());
}

class AbhayaVictimApp extends StatelessWidget {
  const AbhayaVictimApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ABHAYA - Victim Support',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1E3A8A)),
        useMaterial3: true,
      ),
      home: const MainContainer(),
    );
  }
}

class MainContainer extends StatefulWidget {
  const MainContainer({super.key});

  @override
  State<MainContainer> createState() => _MainContainerState();
}

class _MainContainerState extends State<MainContainer> {
  bool _isLoggedIn = false;
  String _caseId = "KA-2026-BLR-001";
  String _lastStatus = "Stable";
  int _selectedIndex = 0;

  void _triggerSos() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.warning, color: Colors.red),
            SizedBox(width: 8),
            Text('Emergency SOS Alert'),
          ],
        ),
        content: const Text(
          'Emergency distress alert triggered! Police Station & assigned Social Worker have been dispatched telemetry coordinates.',
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('OK')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!_isLoggedIn) {
      return LoginScreen(
        onLoginSuccess: (phone, caseId) {
          setState(() {
            _caseId = caseId;
            _isLoggedIn = true;
          });
        },
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('ABHAYA Support', style: TextStyle(fontSize: 18, color: Colors.white)),
            Text('Case: $_caseId', style: const TextStyle(fontSize: 12, color: Colors.white70)),
          ],
        ),
        backgroundColor: const Color(0xFF1E3A8A),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () => setState(() => _isLoggedIn = false),
          ),
        ],
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          _buildHomeScreen(),
          CheckInScreen(
            caseId: _caseId,
            onCompleteCheckIn: (mood, intensity) {
              setState(() {
                _lastStatus = (mood == "Distressed" || mood == "I Need Help") ? "Attention Flagged" : "Recorded";
                _selectedIndex = 0;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Wellbeing status logged: $mood')),
              );
            },
          ),
          AssistanceScreen(caseId: _caseId),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (idx) => setState(() => _selectedIndex = idx),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Overview'),
          BottomNavigationBarItem(icon: Icon(Icons.sentiment_satisfied_alt), label: 'Check-in'),
          BottomNavigationBarItem(icon: Icon(Icons.handshake_outlined), label: 'Assistance'),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _triggerSos,
        backgroundColor: Colors.red,
        icon: const Icon(Icons.emergency, color: Colors.white),
        label: const Text('EMERGENCY SOS', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildHomeScreen() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            color: Colors.white,
            elevation: 2,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Case Progress Timeline', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  _buildTimelineItem('Complaint Registered', true),
                  _buildTimelineItem('FIR Registered', true),
                  _buildTimelineItem('Investigation in Progress', true),
                  _buildTimelineItem('Court Proceedings', false),
                  _buildTimelineItem('Case Resolved', false),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            color: Colors.blue.shade50,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  const Icon(Icons.notification_important, color: Color(0xFF1E3A8A)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Daily check-in status: $_lastStatus. Keep up regular check-ins so your support team stays in touch.',
                      style: const TextStyle(color: Color(0xFF1E3A8A), fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(String label, bool isDone) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(isDone ? Icons.check_circle : Icons.radio_button_unchecked, color: isDone ? Colors.green : Colors.grey, size: 20),
          const SizedBox(width: 10),
          Text(label, style: TextStyle(color: isDone ? Colors.black87 : Colors.grey, fontWeight: isDone ? FontWeight.w500 : FontWeight.normal)),
        ],
      ),
    );
  }
}
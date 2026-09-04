import 'package:flutter/material.dart';

class CheckInScreen extends StatefulWidget {
  final String caseId;
  final Function(String response, String voiceIntensity) onCompleteCheckIn;

  const CheckInScreen({
    super.key,
    required this.caseId,
    required this.onCompleteCheckIn,
  });

  @override
  State<CheckInScreen> createState() => _CheckInScreenState();
}

class _CheckInScreenState extends State<CheckInScreen> {
  String? _selectedMood;
  bool _voiceSampleRecorded = false;
  bool _isRecording = false;

  final List<Map<String, dynamic>> _moodOptions = [
    {"label": "Good", "emoji": "😊", "color": Colors.green},
    {"label": "Okay", "emoji": "🙂", "color": Colors.blue},
    {"label": "Not Good", "emoji": "😐", "color": Colors.orange},
    {"label": "Distressed", "emoji": "😟", "color": Colors.deepOrange},
    {"label": "I Need Help", "emoji": "🆘", "color": Colors.red},
  ];

  void _simulateVoiceRecording() {
    setState(() => _isRecording = true);
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _isRecording = false;
        _voiceSampleRecorded = true;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Voice sample processed for acoustic markers.')),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Wellbeing Check-in'),
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.blue.shade200),
              ),
              child: const Text(
                'Hi, we are checking in with you today. You do not have to fill lengthy forms—just let us know how you feel.',
                style: TextStyle(fontSize: 15, color: Color(0xFF1E3A8A)),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'How are you feeling right now?',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            ..._moodOptions.map((option) {
              final isSelected = _selectedMood == option['label'];
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                child: InkWell(
                  onTap: () => setState(() => _selectedMood = option['label']),
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: isSelected ? option['color'].withOpacity(0.15) : Colors.white,
                      border: Border.all(
                        color: isSelected ? option['color'] : Colors.grey.shade300,
                        width: isSelected ? 2 : 1,
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        Text(option['emoji'], style: const TextStyle(fontSize: 26)),
                        const SizedBox(width: 16),
                        Text(
                          option['label'],
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                            color: isSelected ? option['color'] : Colors.black87,
                          ),
                        ),
                        const Spacer(),
                        if (isSelected) Icon(Icons.check_circle, color: option['color']),
                      ],
                    ),
                  ),
                ),
              );
            }),
            const SizedBox(height: 20),
            const Divider(),
            const SizedBox(height: 10),
            const Text(
              'Optional Voice Check-in',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            const Text(
              'Say a brief sentence (e.g. "I am checking in for today") to extract vocal tone indicators.',
              style: TextStyle(fontSize: 13, color: Colors.grey),
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: _isRecording ? null : _simulateVoiceRecording,
              icon: Icon(_isRecording ? Icons.mic_none : Icons.mic, color: const Color(0xFF1E3A8A)),
              label: Text(_isRecording ? 'Listening...' : (_voiceSampleRecorded ? 'Voice Sample Attached ✓' : 'Record Short Voice Note')),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: _selectedMood == null
                  ? null
                  : () {
                      final intensity = (_selectedMood == "Distressed" || _selectedMood == "I Need Help")
                          ? "high_stress"
                          : "normal";
                      widget.onCompleteCheckIn(_selectedMood!, intensity);
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E3A8A),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Submit Check-in', style: TextStyle(color: Colors.white, fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }
}
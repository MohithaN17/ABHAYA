import 'package:flutter/material.dart';

class AssistanceScreen extends StatefulWidget {
  final String caseId;
  const AssistanceScreen({super.key, required this.caseId});

  @override
  State<AssistanceScreen> createState() => _AssistanceScreenState();
}

class _AssistanceScreenState extends State<AssistanceScreen> {
  final List<Map<String, dynamic>> _activeRequests = [
    {
      "id": "REQ-101",
      "type": "Shelter / Safe Place",
      "status": "Under Review",
      "date": "03 Sept 2026",
      "assignedTo": "Social Worker Team",
      "icon": Icons.night_shelter,
      "color": Colors.orange,
    },
    {
      "id": "REQ-098",
      "type": "Legal Assistance",
      "status": "Assigned",
      "date": "01 Sept 2026",
      "assignedTo": "District Legal Services Authority",
      "icon": Icons.gavel,
      "color": Colors.blue,
    }
  ];

  final List<Map<String, dynamic>> _categories = [
    {"name": "🧠 Counselling", "type": "Counselling", "desc": "Psychological support & session booking"},
    {"name": "🤝 Social Worker Support", "type": "Social Worker", "desc": "Direct case follow-up & assistance"},
    {"name": "🏠 Shelter / Safe Place", "type": "Shelter", "desc": "Safe accommodation & emergency shelter"},
    {"name": "⚖️ Legal Assistance", "type": "Legal", "desc": "Connection with authorized legal aid"},
    {"name": "💰 Financial Aid", "type": "Financial", "desc": "Victim compensation & rehabilitation pathways"},
    {"name": "🏥 Medical Assistance", "type": "Medical", "desc": "Emergency healthcare & medical referrals"},
  ];

  void _submitNewRequest(String category) {
    setState(() {
      _activeRequests.insert(0, {
        "id": "REQ-${102 + _activeRequests.length}",
        "type": category,
        "status": "Submitted",
        "date": "Today",
        "assignedTo": "Pending Review",
        "icon": Icons.help_outline,
        "color": Colors.purple,
      });
    });
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Assistance request for $category submitted successfully.')),
    );
  }

  void _showRequestModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select Assistance Required',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Your wellbeing involves practical needs. Select the type of support you require:',
              style: TextStyle(fontSize: 13, color: Colors.grey),
            ),
            const SizedBox(height: 16),
            ..._categories.map((cat) => ListTile(
                  leading: const Icon(Icons.check_circle_outline, color: Color(0xFF1E3A8A)),
                  title: Text(cat['name']!, style: const TextStyle(fontWeight: FontWeight.w600)),
                  subtitle: Text(cat['desc']!, style: const TextStyle(fontSize: 12)),
                  onTap: () => _submitNewRequest(cat['type']!),
                )),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Support & Assistance'),
        backgroundColor: const Color(0xFF1E3A8A),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ElevatedButton.icon(
              onPressed: _showRequestModal,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E3A8A),
                minimumSize: const Size.fromHeight(50),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              icon: const Icon(Icons.add_circle_outline, color: Colors.white),
              label: const Text('Request New Assistance', style: TextStyle(color: Colors.white, fontSize: 16)),
            ),
            const SizedBox(height: 24),
            const Text('My Assistance Requests', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            ..._activeRequests.map((req) => Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  elevation: 2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(req['type'], style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: (req['color'] as Color).withOpacity(0.15),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                req['status'],
                                style: TextStyle(color: req['color'] as Color, fontWeight: FontWeight.bold, fontSize: 12),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text('Request ID: ${req['id']} • Submitted: ${req['date']}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                        const SizedBox(height: 6),
                        Text('Assigned To: ${req['assignedTo']}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                      ],
                    ),
                  ),
                )),
          ],
        ),
      ),
    );
  }
}
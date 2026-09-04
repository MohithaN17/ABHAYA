/// IVRS Fallback Service for Basic Phone Users or Uninstalled App Scenarios (48-hr fallback)
class IvrsFallbackService {
  static Map<String, dynamic> simulateIvrsTrigger({required String phoneNumber, required String caseId}) {
    return {
      "phone": phoneNumber,
      "case_id": caseId,
      "status": "IVRS Dispatched",
      "prompt_played": "Support service confirmation and assisted guidance call.",
      "user_options": {
        "1": "Connect with support person directly[cite: 1]",
        "2": "Receive SMS app guide link[cite: 1]",
        "3": "Opt-out / Disconnect"
      },
      "consent_recorded": true
    };
  }
}
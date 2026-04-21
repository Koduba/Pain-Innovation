import { SurveySection, ColorConfig } from '@/types/survey';

export const SECTIONS: SurveySection[] = [
  {
    title: "General key messages",
    desc: "Overarching principles of the clinical guidelines.",
    qs: [
      "Patients should be encouraged to engage in their care even before seeing a clinician.",
      "Patient education is important across all recommendations.",
      "The recommendations are based on evidence.",
      "The progression from self-care to clinical care is designed to be logical and flexible.",
      "Patients should understand the typical course and management of acute low back pain (ALBP).",
      "Movement is considered safe and beneficial for recovery.",
      "Inactivity or bedrest can slow recovery.",
      "Care should begin with the least invasive, lowest-risk options.",
      "Unnecessary imaging and early opioid use should be avoided.",
      "Psychosocial factors influence recovery.",
      "Care should only be escalated when clinically appropriate.",
      "If medications are used, they should start at low doses.",
      "Patients can combine self-management with clinical treatments.",
      "These recommendations are meant to support shared decision-making."
    ]
  },
  {
    title: "Assessment & imaging",
    desc: "Appropriate use of imaging in acute low back pain.",
    qs: [
      "Imaging should be avoided in most patients with atraumatic ALBP under 6 weeks.",
      "Imaging should only be used when \"red flag\" symptoms are present.",
      "Most cases of ALBP resolve without serious pathology.",
      "Imaging does not improve pain or recovery outcomes in uncomplicated cases.",
      "Imaging can lead to unnecessary anxiety or costs.",
      "Imaging exposes patients to potential harm (e.g., radiation).",
      "Signs of serious conditions are usually present when imaging is needed."
    ]
  },
  {
    title: "Red flags / imaging criteria",
    desc: "Clinical indicators that may warrant further investigation.",
    qs: [
      "Imaging should be considered for suspected spinal cord compression or cauda equina syndrome.",
      "Symptoms such as bowel/bladder dysfunction or saddle anesthesia are warning signs.",
      "Progressive weakness should prompt further evaluation.",
      "Infection or cancer risk factors should trigger imaging.",
      "Persistent pain, numbness, or bowel/bladder dysfunction should prompt immediate evaluation."
    ]
  },
  {
    title: "Self-management (Rec. 1)",
    desc: "First-line self-management strategies for patients with ALBP.",
    qs: [
      "Patients should receive information about the normal course of ALBP.",
      "Patients should be reassured that most ALBP resolves on its own.",
      "Patients should stay active during recovery.",
      "Low-impact activities can help recovery.",
      "Heat therapy should be considered.",
      "Over-the-counter NSAIDs can be used if safe.",
      "Patients should seek care if symptoms worsen or persist.",
      "Early self-management reduces reliance on imaging and medications."
    ]
  },
  {
    title: "If not improving (Rec. 2a)",
    desc: "When patients do not adequately improve with initial self-management.",
    qs: [
      "Additional treatments should be considered if symptoms persist after 1–2 weeks.",
      "Multiple treatment options can be offered at the same time.",
      "Non-drug treatments should be prioritized.",
      "Exercise-based physical therapy can help improve function.",
      "Spinal manipulation or acupuncture can provide benefit.",
      "NSAIDs should be optimized before trying other medications.",
      "Muscle relaxants provide modest benefit.",
      "Patient preferences and safety should guide treatment choices.",
      "Improvements from these treatments are usually modest and short-term."
    ]
  },
  {
    title: "Radiculopathy-specific (Rec. 2b)",
    desc: "Treatments specific to patients presenting with radiculopathy.",
    qs: [
      "Steroids should only be considered in patients with radiculopathy.",
      "Evidence for steroids and epidural injections is limited.",
      "These treatments should be avoided in non-radicular back pain.",
      "Steroids should be used at low doses and for short durations.",
      "These treatments are meant for temporary relief rather than cure.",
      "Patients should continue activity and therapy alongside these treatments."
    ]
  },
  {
    title: "Opioids (Rec. 3)",
    desc: "Appropriate use of opioids in the management of ALBP.",
    qs: [
      "Opioids should be avoided as first-line treatment for ALBP.",
      "Opioids are generally ineffective for improving function.",
      "Opioids should only be used in rare, selected cases.",
      "Non-opioid treatments should be tried first.",
      "If used, opioids should be short-acting and time-limited.",
      "Clinicians should start with low doses of opioids.",
      "Opioids carry risks such as long-term use and side effects.",
      "Opioids should be avoided when safer alternatives are effective.",
      "Patients should be counseled on risks and safe use if prescribed."
    ]
  }
];

export const LABELS = [
  "",
  "Strongly disagree",
  "Disagree", 
  "Neutral",
  "Agree",
  "Strongly agree"
];

export const COLORS: (ColorConfig | null)[] = [
  null,
  { bg: "#fbe9e7", color: "#c62828", track: "#c62828" },
  { bg: "#fde8cc", color: "#bf360c", track: "#e64a19" },
  { bg: "#f5f5f5", color: "#555", track: "#9e9e9e" },
  { bg: "#e8f5e9", color: "#2e7d32", track: "#43a047" },
  { bg: "#81c784", color: "#1b5e20", track: "#1b5e20" },
];

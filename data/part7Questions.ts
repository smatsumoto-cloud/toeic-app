import type { Choice } from "./part5Questions";

export interface Part7Question {
  number: 1 | 2 | 3;
  question: string;
  choices: Record<Choice, string>;
  answer: Choice;
  explanation: string;
  choiceExplanations: Record<Choice, string>;
}

export interface Part7Passage {
  id: number;
  type: "email" | "advertisement" | "notice" | "letter" | "memo";
  title: string;
  header: string;
  body: string;
  questions: Part7Question[];
}

export const part7Passages: Part7Passage[] = [
  // ===== Passage 1: Email =====
  {
    id: 1,
    type: "email",
    title: "Annual Team Retreat",
    header: "From: Sarah Chen, Marketing Director\nTo: All Marketing Staff\nSubject: Upcoming Team Retreat\nDate: March 15",
    body: `Dear Team,

I am pleased to announce that our annual team retreat will be held on April 12–13 at the Lakeside Conference Center in Millbrook. This year's retreat will focus on developing our Q2 marketing strategies and strengthening team collaboration.

The agenda includes strategy workshops, a team-building activity on Saturday afternoon, and a dinner banquet on Saturday evening. Please note that accommodation will be provided for all participants.

All marketing staff are expected to attend. If you have any dietary restrictions or special requirements, please inform HR by March 25. Transportation will be arranged from the main office; departure is scheduled for 8:00 A.M. on April 12.

We look forward to a productive and enjoyable event.

Best regards,
Sarah Chen
Marketing Director`,
    questions: [
      {
        number: 1,
        question: "What is the purpose of this email?",
        choices: {
          A: "To announce a new marketing campaign",
          B: "To inform staff about an upcoming team retreat",
          C: "To request expense reports from employees",
          D: "To introduce a new company policy",
        },
        answer: "B",
        explanation:
          "メール冒頭に「annual team retreat will be held on April 12–13」とあり、チームリトリートを知らせる目的のメールです。",
        choiceExplanations: {
          A: "新しいマーケティングキャンペーンの告知ではありません。",
          B: "「I am pleased to announce that our annual team retreat will be held...」と明確に述べられています。",
          C: "経費報告の依頼には触れていません。",
          D: "新しい会社方針の導入については言及されていません。",
        },
      },
      {
        number: 2,
        question: "What are staff members asked to do by March 25?",
        choices: {
          A: "Submit their marketing strategies",
          B: "Book their own accommodation",
          C: "Notify HR of any dietary restrictions",
          D: "Confirm attendance at the retreat",
        },
        answer: "C",
        explanation:
          "「If you have any dietary restrictions or special requirements, please inform HR by March 25」と明記されています。",
        choiceExplanations: {
          A: "マーケティング戦略の提出期限は述べられていません。",
          B: "宿泊は会社が手配（accommodation will be provided）するため、自分で予約する必要はありません。",
          C: "食事制限や特別な要望があればHRに3月25日までに連絡するよう求められています。",
          D: "参加確認の期限については言及されていません。",
        },
      },
      {
        number: 3,
        question: "What is stated about transportation to the retreat?",
        choices: {
          A: "Staff must arrange their own transportation",
          B: "Transportation will be provided from the main office",
          C: "A shuttle will run throughout the retreat",
          D: "Staff will be reimbursed for travel expenses",
        },
        answer: "B",
        explanation:
          "「Transportation will be arranged from the main office; departure is scheduled for 8:00 A.M.」と記載されています。",
        choiceExplanations: {
          A: "自分で手配する必要はなく、会社が交通手段を手配します。",
          B: "本社からの交通手段が手配されると明記されています。",
          C: "リトリート中のシャトルについては触れていません。",
          D: "交通費の払い戻しについては言及されていません。",
        },
      },
    ],
  },

  // ===== Passage 2: Advertisement =====
  {
    id: 2,
    type: "advertisement",
    title: "Senior Software Engineer — TechVision Inc.",
    header: "POSITION AVAILABLE\nSenior Software Engineer\nTechVision Inc. — San Francisco, CA",
    body: `TechVision Inc., a leading provider of cloud-based business solutions, is seeking an experienced Senior Software Engineer to join our growing team in San Francisco.

Responsibilities:
• Design and develop scalable software solutions
• Collaborate with cross-functional teams on product development
• Mentor junior engineers and conduct code reviews
• Participate in agile development processes

Requirements:
• Bachelor's degree in Computer Science or a related field
• Minimum 5 years of software development experience
• Proficiency in Python, Java, or similar programming languages
• Strong problem-solving skills and attention to detail

We offer a competitive salary, comprehensive health benefits, flexible working hours, and annual performance bonuses. Remote work options are also available.

To apply, please send your resume and cover letter to careers@techvision.com by April 30.`,
    questions: [
      {
        number: 1,
        question: "What type of company is TechVision Inc.?",
        choices: {
          A: "A recruitment agency",
          B: "A provider of cloud-based business solutions",
          C: "A software training company",
          D: "An information technology consulting firm",
        },
        answer: "B",
        explanation:
          "冒頭に「a leading provider of cloud-based business solutions」と明記されています。",
        choiceExplanations: {
          A: "採用代理店ではありません。",
          B: "「a leading provider of cloud-based business solutions」と直接述べられています。",
          C: "ソフトウェアトレーニング会社とは書かれていません。",
          D: "ITコンサルティング会社とは書かれていません。",
        },
      },
      {
        number: 2,
        question: "What is one of the requirements for the position?",
        choices: {
          A: "A master's degree in Computer Science",
          B: "Experience managing a large team",
          C: "At least five years of software development experience",
          D: "Fluency in three or more programming languages",
        },
        answer: "C",
        explanation:
          "Requirements に「Minimum 5 years of software development experience」と記載されています。",
        choiceExplanations: {
          A: "修士号ではなく学士号（Bachelor's degree）が要件です。",
          B: "大規模チームの管理経験は要件に含まれていません。",
          C: "「Minimum 5 years of software development experience」が明確な要件として挙げられています。",
          D: "3つ以上のプログラミング言語への精通は求められていません。",
        },
      },
      {
        number: 3,
        question: "What benefit is mentioned in the advertisement?",
        choices: {
          A: "Free accommodation near the office",
          B: "Company-sponsored international travel",
          C: "Flexible working hours",
          D: "Stock options in the company",
        },
        answer: "C",
        explanation:
          "「We offer a competitive salary, comprehensive health benefits, flexible working hours, and annual performance bonuses」と記述されています。",
        choiceExplanations: {
          A: "オフィス近くの無料宿泊については触れていません。",
          B: "海外出張については言及されていません。",
          C: "「flexible working hours」が福利厚生として明記されています。",
          D: "ストックオプションについては言及されていません。",
        },
      },
    ],
  },

  // ===== Passage 3: Notice =====
  {
    id: 3,
    type: "notice",
    title: "Temporary Entrance Change",
    header: "NOTICE TO ALL EMPLOYEES\nFrom: Facilities Management Department",
    body: `Effective Monday, April 7, the main entrance of our headquarters building will be temporarily closed for renovation. During this period, all employees must use the Side Entrance on Oak Street.

Please be aware that the renovation is expected to be completed within four weeks. The work involves upgrading the lobby facilities, installing new security systems, and improving accessibility features for visitors with disabilities.

While the main entrance is closed, temporary security desks will be set up at the Oak Street entrance. All employees will be required to show their employee ID cards when entering the building.

Parking arrangements will remain unchanged. However, visitors should be directed to use the Oak Street entrance and notified in advance. Please inform any clients or external partners who may visit our offices during this period.

We apologize for any inconvenience this may cause and appreciate your cooperation.

Facilities Management Department`,
    questions: [
      {
        number: 1,
        question: "What is the main purpose of this notice?",
        choices: {
          A: "To announce a change in company security policy",
          B: "To inform employees about temporary entrance changes",
          C: "To introduce new parking arrangements",
          D: "To announce the relocation of the main office",
        },
        answer: "B",
        explanation:
          "このお知らせは、工事のためメインエントランスが一時閉鎖され、Oak Street の側入口を使用するよう伝えるものです。",
        choiceExplanations: {
          A: "セキュリティポリシーの変更が主な目的ではありません。",
          B: "「the main entrance will be temporarily closed」と従業員への入口変更を知らせることが目的です。",
          C: "「Parking arrangements will remain unchanged」とあり、駐車場の変更はありません。",
          D: "オフィスの移転ではなく入口の一時変更です。",
        },
      },
      {
        number: 2,
        question: "What must employees do when using the Oak Street entrance?",
        choices: {
          A: "Register their name at the security desk",
          B: "Apply for a temporary access card",
          C: "Present their employee ID cards",
          D: "Sign a daily visitor log",
        },
        answer: "C",
        explanation:
          "「All employees will be required to show their employee ID cards when entering the building」と明記されています。",
        choiceExplanations: {
          A: "名前の登録については書かれていません。",
          B: "一時アクセスカードの申請については触れていません。",
          C: "「show their employee ID cards」が必須要件として述べられています。",
          D: "訪問者ログへの署名は求められていません。",
        },
      },
      {
        number: 3,
        question: "What is NOT mentioned as part of the renovation?",
        choices: {
          A: "Upgrading lobby facilities",
          B: "Installing new security systems",
          C: "Replacing office furniture",
          D: "Improving accessibility for visitors with disabilities",
        },
        answer: "C",
        explanation:
          "工事内容として挙げられているのは①ロビーのアップグレード②セキュリティシステム設置③障害者向けアクセシビリティ改善の3点です。オフィス家具の交換は含まれていません。",
        choiceExplanations: {
          A: "「upgrading the lobby facilities」は工事内容として明記されています。",
          B: "「installing new security systems」は工事内容として明記されています。",
          C: "オフィス家具の交換は一切触れられていません。",
          D: "「improving accessibility features for visitors with disabilities」は明記されています。",
        },
      },
    ],
  },

  // ===== Passage 4: Letter =====
  {
    id: 4,
    type: "letter",
    title: "Guest Relations Response",
    header: "Hartwell Hotels & Resorts\nCustomer Relations Department\n200 Grand Avenue, New York, NY 10001\nMarch 10, 2026",
    body: `Dear Mr. Nakamura,

Thank you for your recent stay at the Hartwell Downtown Hotel and for taking the time to share your feedback. We sincerely apologize for the issues you experienced during your visit, particularly regarding the delayed room service and the noise disturbance on the evening of March 5.

We take all guest feedback seriously, and your comments have been shared with the relevant department managers. We have implemented additional training for our room service staff and have reviewed our noise management procedures to prevent similar issues in the future.

As a token of our appreciation for your patience and continued loyalty, we would like to offer you a complimentary one-night stay at any Hartwell property, valid for 12 months from the date of this letter. Please contact our reservations team at 1-800-555-0192 to arrange your booking.

We hope to have the opportunity to welcome you again and provide you with the exceptional experience you deserve.

Sincerely,
Patricia Wells
Director of Guest Relations
Hartwell Hotels & Resorts`,
    questions: [
      {
        number: 1,
        question: "Why was this letter sent to Mr. Nakamura?",
        choices: {
          A: "To confirm an upcoming hotel reservation",
          B: "To respond to a complaint about his recent stay",
          C: "To offer him membership in a loyalty program",
          D: "To inform him about new hotel services",
        },
        answer: "B",
        explanation:
          "「We sincerely apologize for the issues you experienced during your visit」とあり、宿泊中の問題へのお詫びと対応を伝えるための手紙です。",
        choiceExplanations: {
          A: "今後の予約の確認ではありません。",
          B: "宿泊中の問題に対する謝罪と対応を伝えるための返信です。",
          C: "ロイヤルティプログラムへの勧誘ではありません。",
          D: "新しいホテルサービスの告知ではありません。",
        },
      },
      {
        number: 2,
        question: "What problems did Mr. Nakamura experience at the hotel?",
        choices: {
          A: "Incorrect billing and poor food quality",
          B: "Delayed room service and a noise disturbance",
          C: "An overbooked reservation and a damaged room",
          D: "Long wait times at check-in and check-out",
        },
        answer: "B",
        explanation:
          "「the issues you experienced...particularly regarding the delayed room service and the noise disturbance」と具体的に述べられています。",
        choiceExplanations: {
          A: "請求間違いや料理の質については触れていません。",
          B: "「delayed room service and the noise disturbance」が問題として明記されています。",
          C: "予約の重複や部屋の破損については触れていません。",
          D: "チェックイン・チェックアウトの待ち時間については言及されていません。",
        },
      },
      {
        number: 3,
        question: "What is offered to Mr. Nakamura as compensation?",
        choices: {
          A: "A discount on his next hotel booking",
          B: "A refund for his previous stay",
          C: "A complimentary one-night stay at any Hartwell property",
          D: "A complimentary upgrade on his next visit",
        },
        answer: "C",
        explanation:
          "「we would like to offer you a complimentary one-night stay at any Hartwell property, valid for 12 months」と記載されています。",
        choiceExplanations: {
          A: "割引提供ではなく無料宿泊の提供です。",
          B: "前回の滞在費の返金については触れていません。",
          C: "「complimentary one-night stay at any Hartwell property」が補償として明確に提示されています。",
          D: "アップグレードではなく無料一泊宿泊の提供です。",
        },
      },
    ],
  },

  // ===== Passage 5: Memo =====
  {
    id: 5,
    type: "memo",
    title: "Updated Remote Work Policy",
    header: "MEMORANDUM\nTO: All Department Heads\nFROM: Human Resources Department\nDATE: March 8, 2026\nRE: Updated Remote Work Policy",
    body: `As of April 1, the company will implement a revised remote work policy. Under the new guidelines, employees may work remotely for up to three days per week, an increase from the current two-day allowance.

To be eligible for remote work, employees must have completed at least six months of employment and maintained a satisfactory performance rating in their most recent evaluation. Employees wishing to increase their remote work days should submit a written request to their direct supervisor for approval.

All remote work must be conducted in accordance with the company's data security guidelines. Employees are responsible for ensuring a reliable internet connection and a suitable work environment during remote work days.

Department heads are asked to review the updated Remote Work Policy document, which has been posted on the company intranet, and communicate the changes to their teams by March 20.

Please direct any questions to hr@company.com.`,
    questions: [
      {
        number: 1,
        question: "What is the main change described in the memo?",
        choices: {
          A: "Employees may no longer work from home",
          B: "The number of allowed remote work days per week has been increased",
          C: "All employees must work on-site starting April 1",
          D: "A new performance evaluation system will be introduced",
        },
        answer: "B",
        explanation:
          "「employees may work remotely for up to three days per week, an increase from the current two-day allowance」とあり、リモートワーク可能日数が2日から3日に増加します。",
        choiceExplanations: {
          A: "在宅勤務が禁止されるのではなく、日数が増加します。",
          B: "「up to three days per week, an increase from the current two-day allowance」と明確に述べられています。",
          C: "4月1日から全員出社義務という内容ではありません。",
          D: "新しい人事評価制度の導入については触れていません。",
        },
      },
      {
        number: 2,
        question: "What must an employee do to be eligible for remote work?",
        choices: {
          A: "Obtain written approval from the HR department",
          B: "Have been employed for at least six months",
          C: "Attend a mandatory remote work training session",
          D: "Submit a detailed daily work-from-home plan",
        },
        answer: "B",
        explanation:
          "「employees must have completed at least six months of employment」が資格要件の一つとして明記されています。",
        choiceExplanations: {
          A: "上司への申請（supervisor）は必要ですが、HR部門への書面承認は要件ではありません。",
          B: "「completed at least six months of employment」がリモートワークの資格要件です。",
          C: "義務的なトレーニングについては触れていません。",
          D: "詳細な日次計画の提出は要求されていません。",
        },
      },
      {
        number: 3,
        question: "What are department heads asked to do by March 20?",
        choices: {
          A: "Send approval forms to the HR department",
          B: "Update the company intranet with the new policy",
          C: "Communicate the policy changes to their teams",
          D: "Evaluate each employee's remote work eligibility",
        },
        answer: "C",
        explanation:
          "「communicate the changes to their teams by March 20」と部門長への指示として明記されています。",
        choiceExplanations: {
          A: "承認書類をHRに送ることは求められていません。",
          B: "イントラネットへの掲載はすでに済んでいます（「has been posted」）。",
          C: "「communicate the changes to their teams by March 20」が部門長への指示です。",
          D: "各従業員の適格性評価は部門長の指示内容ではありません。",
        },
      },
    ],
  },
];

export const PART7_TOTAL_QUESTIONS = part7Passages.reduce(
  (sum, p) => sum + p.questions.length,
  0
);

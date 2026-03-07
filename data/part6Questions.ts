import type { Choice } from "./part5Questions";

export interface Part6Question {
  blankNumber: 1 | 2 | 3 | 4;
  choices: Record<Choice, string>;
  answer: Choice;
  explanation: string;
  choiceExplanations: Record<Choice, string>;
}

export interface Part6Passage {
  id: number;
  type: "email" | "memo" | "letter" | "notice";
  title: string;
  header: string; // 差出人・宛先など（HTMLなしのテキスト）
  body: string;   // (1)_____ 形式の穴埋みテキスト
  questions: Part6Question[];
}

export const part6Passages: Part6Passage[] = [
  // ===== Passage 1: Email =====
  {
    id: 1,
    type: "email",
    title: "Year-End Budget Review",
    header: "To: All Department Heads\nFrom: Patricia Wong, CEO\nSubject: Year-End Budget Review",
    body: `I would like to remind everyone that the year-end budget review meeting is (1)_____ for December 15. All department heads are required to prepare a detailed summary of their (2)_____ expenses and projected costs for the coming year. Please submit your reports to the finance department no (3)_____ than December 10. If you need (4)_____ with preparing the report, please do not hesitate to contact Michael Tanaka in the finance department.`,
    questions: [
      {
        blankNumber: 1,
        choices: { A: "scheduled", B: "scheduling", C: "schedule", D: "scheduler" },
        answer: "A",
        explanation: "be scheduled for〜（〜に予定されている）という受動態の表現です。形容詞的に使われる scheduled が正解です。",
        choiceExplanations: {
          A: "scheduled は過去分詞が形容詞化したもので、be scheduled for ～ = 「〜に予定されている」という頻出表現です。",
          B: "scheduling は動名詞・現在分詞で、is scheduling なら「今スケジューリングしている最中」となり文意に合いません。",
          C: "schedule は動詞原形で、be の後に原形は置けません。",
          D: "scheduler は「スケジューラー（人やツール）」という名詞で文意に合いません。",
        },
      },
      {
        blankNumber: 2,
        choices: { A: "actual", B: "actually", C: "actualize", D: "actuality" },
        answer: "A",
        explanation: "名詞 expenses を修飾する形容詞が必要です。actual（実際の）が正解です。",
        choiceExplanations: {
          A: "actual は形容詞「実際の」で、actual expenses = 「実際の経費」として正しく使えます。",
          B: "actually は副詞で、名詞を直接修飾できません。",
          C: "actualize は動詞「実現する」で、品詞が合いません。",
          D: "actuality は名詞「実際」で、名詞の前に名詞は基本的に置けません。",
        },
      },
      {
        blankNumber: 3,
        choices: { A: "late", B: "later", C: "lately", D: "latest" },
        answer: "B",
        explanation: "no later than ～ = 「〜より遅くとも・〜までに」という慣用表現です。",
        choiceExplanations: {
          A: "no late than という表現は存在しません。",
          B: "no later than は「〜より遅くとも」という意味の重要表現で、締め切りを表します。",
          C: "lately は副詞「最近」で、この文脈には合いません。",
          D: "no latest than という表現は存在しません。",
        },
      },
      {
        blankNumber: 4,
        choices: { A: "assistance", B: "assist", C: "assistant", D: "assisting" },
        answer: "A",
        explanation: "need assistance with ～（〜についての支援が必要）という表現です。need の目的語には名詞が来ます。",
        choiceExplanations: {
          A: "assistance は名詞「支援・手助け」で、need assistance with ～ という自然な表現になります。",
          B: "assist は動詞「手伝う」で、need の後に動詞原形は来ません（need to assist なら可）。",
          C: "assistant は名詞「アシスタント」で、文意が「アシスタントが必要」となり不自然です。",
          D: "assisting は動名詞・現在分詞で、need assisting は「手伝われる必要がある」という受動的な意味になり不自然です。",
        },
      },
    ],
  },

  // ===== Passage 2: Memo =====
  {
    id: 2,
    type: "memo",
    title: "Office Relocation Notice",
    header: "MEMORANDUM\nTo: All Employees\nFrom: Facilities Management\nDate: March 1",
    body: `Please be informed that our Tokyo office will be (1)_____ to a new location on April 1. The new premises are (2)_____ at 3-5-2 Shinjuku, on the 15th floor. Employees who commute by train are advised that Shinjuku Station is the (3)_____ convenient station. Moving arrangements will be handled by a professional moving company. Any (4)_____ or concerns should be directed to HR at extension 201.`,
    questions: [
      {
        blankNumber: 1,
        choices: { A: "relocating", B: "relocated", C: "relocation", D: "relocate" },
        answer: "A",
        explanation: "will be relocating（未来進行形）= 「移転する予定です」という予定の表現です。",
        choiceExplanations: {
          A: "will be relocating は未来進行形で、「4月1日に移転します（移転する過程にある）」という予定を表します。",
          B: "will be relocated は未来受動形で「移転させられる」となり、オフィスが自ら移転するという文脈にやや不自然。",
          C: "relocation は名詞で、be の後には動詞形が必要です。",
          D: "will be relocate は文法的に誤りです（be + 原形にはなれません）。",
        },
      },
      {
        blankNumber: 2,
        choices: { A: "located", B: "locating", C: "location", D: "locate" },
        answer: "A",
        explanation: "be located at ～（〜に位置している）という受動態の定型表現です。",
        choiceExplanations: {
          A: "located は過去分詞で、be located at ～ = 「〜に所在する」という頻出表現を作ります。",
          B: "locating は現在分詞で、are locating なら「今探している」という意味になり不自然です。",
          C: "location は名詞で、are の後に直接名詞は置けません。",
          D: "locate は動詞原形で、are locate は文法的に誤りです。",
        },
      },
      {
        blankNumber: 3,
        choices: { A: "most", B: "more", C: "much", D: "many" },
        answer: "A",
        explanation: "the + most + 形容詞 = 最上級の形です。「最も便利な駅」という意味になります。",
        choiceExplanations: {
          A: "most は the most convenient の最上級を作り、「最も便利な」という意味になります。",
          B: "more convenient は比較級（2者比較）で、the が付かない形が基本です。",
          C: "much は不可算名詞を修飾し、形容詞の前に置いて強調する場合は比較級・最上級でのみ使います。",
          D: "many は可算名詞の複数形を修飾し、形容詞を修飾しません。",
        },
      },
      {
        blankNumber: 4,
        choices: { A: "inquiries", B: "inquire", C: "inquiry", D: "inquired" },
        answer: "A",
        explanation: "any に続く名詞として複数形の inquiries（問い合わせ）が自然です。",
        choiceExplanations: {
          A: "inquiries は inquiry の複数形で、Any inquiries or concerns = 「ご質問やご懸念」という自然な表現です。",
          B: "inquire は動詞「問い合わせる」で、any の後に動詞は来ません。",
          C: "inquiry は単数形ですが、any の後は複数形が自然な場面です（inquiry も文法的には可）。",
          D: "inquired は動詞の過去形で品詞が合いません。",
        },
      },
    ],
  },

  // ===== Passage 3: Letter =====
  {
    id: 3,
    type: "letter",
    title: "Loyalty Program Welcome",
    header: "Dear Valued Customer,",
    body: `Thank you for your (1)_____ to Greenfield Products. We are delighted to welcome you as a new member of our loyalty program. As a member, you will (2)_____ exclusive discounts on all purchases and early access to new product launches. Your membership card will be (3)_____ to you within 7 business days. Should you have any questions about your membership benefits, please (4)_____ our customer service team at support@greenfield.com.\n\nSincerely,\nGreenfield Products`,
    questions: [
      {
        blankNumber: 1,
        choices: { A: "subscribing", B: "subscription", C: "subscribe", D: "subscribed" },
        answer: "B",
        explanation: "your の後には名詞が来ます。subscription（会員登録・購読）が正解です。",
        choiceExplanations: {
          A: "subscribing は動名詞・現在分詞で、your subscribing という形は可能ですが、your subscription の方が自然です。",
          B: "subscription は名詞「購読・会員登録」で、Thank you for your subscription という定型表現になります。",
          C: "subscribe は動詞原形で、your の後には使えません。",
          D: "subscribed は過去分詞で、your の後に来る形としては不自然です。",
        },
      },
      {
        blankNumber: 2,
        choices: { A: "receive", B: "receiving", C: "received", D: "reception" },
        answer: "A",
        explanation: "will + 動詞原形 の形が必要です。receive（受け取る）が正解です。",
        choiceExplanations: {
          A: "receive は動詞原形で、you will receive という助動詞 + 原形の正しい形です。",
          B: "receiving は現在分詞で、will receiving という形は存在しません。",
          C: "received は過去形・過去分詞で、will received という形は文法的に誤りです。",
          D: "reception は名詞「受付・歓迎」で、品詞が合いません。",
        },
      },
      {
        blankNumber: 3,
        choices: { A: "sent", B: "send", C: "sending", D: "sender" },
        answer: "A",
        explanation: "will be + 過去分詞 の受動態未来形です。be sent to ～（〜に送られる）が正解です。",
        choiceExplanations: {
          A: "sent は過去分詞で、will be sent to you = 「あなたに送られます」という受動態になります。",
          B: "send は動詞原形で、will be send という形は文法的に誤りです。",
          C: "sending は現在分詞で、will be sending は未来進行形ですが、この文脈では受動態が自然です。",
          D: "sender は名詞「送り主」で、品詞が合いません。",
        },
      },
      {
        blankNumber: 4,
        choices: { A: "contact", B: "contacts", C: "contacted", D: "contacting" },
        answer: "A",
        explanation: "please の後には動詞原形が来ます。contact（連絡する）が正解です。",
        choiceExplanations: {
          A: "contact は動詞原形で、please contact ～ = 「〜にご連絡ください」という命令文になります。",
          B: "contacts は三単現形で、命令文では使いません。",
          C: "contacted は過去形・過去分詞で、命令文には合いません。",
          D: "contacting は現在分詞で、please contacting という形は存在しません。",
        },
      },
    ],
  },

  // ===== Passage 4: Notice =====
  {
    id: 4,
    type: "notice",
    title: "New Flexible Work Policy",
    header: "COMPANY ANNOUNCEMENT\nEffective: April 1",
    body: `Effective April 1, the company will (1)_____ a new flexible work policy. Under this policy, employees may work remotely up to three days per week, (2)_____ they obtain prior approval from their supervisor. All remote workers are (3)_____ to maintain their regular working hours and remain accessible by email and phone. More (4)_____ information will be shared at next month's town hall meeting.`,
    questions: [
      {
        blankNumber: 1,
        choices: { A: "implement", B: "implementation", C: "implemented", D: "implementing" },
        answer: "A",
        explanation: "will + 動詞原形 の形が必要です。implement（実施する）が正解です。",
        choiceExplanations: {
          A: "implement は動詞原形で、will implement = 「〜を実施する」という正しい助動詞 + 原形の形です。",
          B: "implementation は名詞で、will の後に名詞は直接来ません。",
          C: "implemented は過去形・過去分詞で、will implemented は文法的に誤りです。",
          D: "implementing は現在分詞で、will implementing という形は存在しません（will be implementing なら進行形で可）。",
        },
      },
      {
        blankNumber: 2,
        choices: { A: "provided that", B: "despite", C: "because of", D: "in addition to" },
        answer: "A",
        explanation: "「上司の事前承認を得ることを条件に」という条件節が必要です。provided that（〜という条件で）が正解です。",
        choiceExplanations: {
          A: "provided that は「〜という条件で・〜ならば」という条件接続詞で、後ろに節（SV）を取ります。",
          B: "despite は逆接の前置詞で後ろに名詞句が来ます。節は続けられません。",
          C: "because of は前置詞句「〜のために」で、節を続けられず文意も合いません。",
          D: "in addition to は「〜に加えて」という付加の前置詞句で、条件の意味を持ちません。",
        },
      },
      {
        blankNumber: 3,
        choices: { A: "required", B: "require", C: "requiring", D: "requirement" },
        answer: "A",
        explanation: "be required to ～（〜することが求められている）という受動態の表現です。",
        choiceExplanations: {
          A: "required は過去分詞で、are required to ～ = 「〜することが義務付けられている」という頻出表現になります。",
          B: "require は動詞原形で、are require という形は文法的に誤りです。",
          C: "requiring は現在分詞で、are requiring なら「現在要求している」となりますが、文意が異なります。",
          D: "requirement は名詞で、are の後に名詞が来ると SVC 構造になりますが、「従業員たちは要件だ」という意味になり不自然です。",
        },
      },
      {
        blankNumber: 4,
        choices: { A: "detailed", B: "detail", C: "detailing", D: "details" },
        answer: "A",
        explanation: "名詞 information を修飾する形容詞が必要です。detailed（詳細な）が正解です。",
        choiceExplanations: {
          A: "detailed は形容詞「詳細な」で、detailed information = 「詳細な情報」という正しい表現です。",
          B: "detail は名詞または動詞で、名詞を直前から修飾する形容詞として使えません。",
          C: "detailing は現在分詞で、名詞の前に置くこともできますが、「詳細を述べている情報」という意味になり不自然です。",
          D: "details は名詞の複数形で、名詞を修飾する形容詞としては使えません。",
        },
      },
    ],
  },
];

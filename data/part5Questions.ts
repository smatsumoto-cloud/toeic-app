export type Choice = "A" | "B" | "C" | "D";

export interface Part5Question {
  id: number;
  category: "語彙" | "時制" | "品詞" | "前置詞" | "接続詞";
  difficulty: 2 | 3 | 4;
  sentence: string; // use _____ for blank
  choices: Record<Choice, string>;
  answer: Choice;
  explanation: string; // Japanese explanation
  choiceExplanations: Record<Choice, string>; // why each choice is right/wrong
}

export const part5Questions: Part5Question[] = [
  // ===== 品詞 (4問) =====
  {
    id: 1,
    category: "品詞",
    difficulty: 2,
    sentence:
      "The company's _____ performance exceeded analysts' expectations for the third consecutive quarter.",
    choices: {
      A: "finance",
      B: "financial",
      C: "financed",
      D: "financially",
    },
    answer: "B",
    explanation:
      "空欄は名詞 performance を修飾する形容詞が必要です。financial（財務上の）が正解です。",
    choiceExplanations: {
      A: "finance は名詞（財務）または動詞（資金を供給する）であり、名詞を修飾できません。",
      B: "financial は形容詞で、名詞 performance を正しく修飾できます。「財務上の業績」という意味になります。",
      C: "financed は動詞の過去形・過去分詞で、ここでは形容詞的用法も難しく文意が通りません。",
      D: "financially は副詞で、動詞や形容詞を修飾しますが、名詞の直前には置けません。",
    },
  },
  {
    id: 2,
    category: "品詞",
    difficulty: 2,
    sentence:
      "The new regulations require all employees to _____ their annual compliance training by December 31.",
    choices: {
      A: "completion",
      B: "complete",
      C: "completely",
      D: "completed",
    },
    answer: "B",
    explanation:
      "require + 目的語 + to 不定詞の構文です。to の後には動詞の原形が入ります。",
    choiceExplanations: {
      A: "completion は名詞（完了）であり、to 不定詞の後には動詞原形が必要です。",
      B: "complete（完了する）は動詞原形で、to complete の形として正しく使えます。",
      C: "completely は副詞で、to の後に直接は置けません。",
      D: "completed は過去形・過去分詞で、to 不定詞の構造には合いません。",
    },
  },
  {
    id: 3,
    category: "品詞",
    difficulty: 3,
    sentence:
      "Mr. Chen spoke _____ during the board meeting, impressing everyone with his thorough analysis.",
    choices: {
      A: "persuasion",
      B: "persuade",
      C: "persuasively",
      D: "persuasive",
    },
    answer: "C",
    explanation:
      "空欄は動詞 spoke を修飾するので副詞が必要です。persuasively（説得力を持って）が正解です。",
    choiceExplanations: {
      A: "persuasion は名詞（説得）で、動詞を修飾することはできません。",
      B: "persuade は動詞（説得する）で、ここでは文構造上使えません。",
      C: "persuasively は副詞で、動詞 spoke を適切に修飾します。「説得力を持って話した」という意味になります。",
      D: "persuasive は形容詞（説得力のある）で、副詞が必要な位置には置けません。",
    },
  },
  {
    id: 4,
    category: "品詞",
    difficulty: 3,
    sentence:
      "The _____ of the new software system has been scheduled for next month.",
    choices: {
      A: "implement",
      B: "implementing",
      C: "implemented",
      D: "implementation",
    },
    answer: "D",
    explanation:
      "文の主語になれるのは名詞だけです。implementation（導入・実施）が正解です。",
    choiceExplanations: {
      A: "implement は動詞（実施する）で、文の主語位置に使う場合は名詞形が必要です。",
      B: "implementing は動名詞または現在分詞で、主語としては可能ですが、of 以下の名詞句と組み合わせるなら名詞形が自然です。",
      C: "implemented は過去分詞で、主語として単独では使えません。",
      D: "implementation は名詞（導入）で、The implementation of ... という主語句を正しく作れます。",
    },
  },

  // ===== 時制 (4問) =====
  {
    id: 5,
    category: "時制",
    difficulty: 3,
    sentence:
      "By the time the project manager arrives tomorrow, the team _____ the first phase of development.",
    choices: {
      A: "will complete",
      B: "will have completed",
      C: "completed",
      D: "has completed",
    },
    answer: "B",
    explanation:
      "By the time ～（未来時点）＋ will have + 過去分詞 の未来完了形が正解です。明日の到着時点までに完了している状況を表します。",
    choiceExplanations: {
      A: "will complete は単純未来で、「到着するまでに完了している」という完了のニュアンスが表せません。",
      B: "will have completed は未来完了形で、「明日マネージャーが到着するまでに、チームは完了しているだろう」と正しく表現できます。",
      C: "completed は過去形で、未来の文脈に合いません。",
      D: "has completed は現在完了形で、tomorrow という未来の時間表現と合いません。",
    },
  },
  {
    id: 6,
    category: "時制",
    difficulty: 4,
    sentence:
      "The company _____ its headquarters to the new business district since last year.",
    choices: {
      A: "relocates",
      B: "has been relocating",
      C: "will relocate",
      D: "had relocated",
    },
    answer: "B",
    explanation:
      "since last year（去年から今も）という表現があるため、現在完了進行形 has been + -ing が正解です。",
    choiceExplanations: {
      A: "relocates は現在形（三単現）で、since 節と一緒に使うのは不自然です。",
      B: "has been relocating は現在完了進行形で、「去年から今も移転を続けている」という継続中の動作を正しく表します。",
      C: "will relocate は未来形で、since last year という過去起点と矛盾します。",
      D: "had relocated は過去完了形で、さらに過去の基準点が必要ですが、この文には存在しません。",
    },
  },
  {
    id: 7,
    category: "時制",
    difficulty: 2,
    sentence:
      "The sales figures for last quarter _____ a significant increase in online orders.",
    choices: {
      A: "show",
      B: "will show",
      C: "showed",
      D: "have been showing",
    },
    answer: "C",
    explanation:
      "last quarter（先四半期）という過去の時間表現があるため、過去形 showed が正解です。",
    choiceExplanations: {
      A: "show は現在形で、過去の時間表現 last quarter と一致しません。",
      B: "will show は未来形で、過去の出来事に使えません。",
      C: "showed は過去形で、last quarter という明確な過去の時点と正しく対応します。",
      D: "have been showing は現在完了進行形で、last quarter のような完結した過去期間には使いません。",
    },
  },
  {
    id: 8,
    category: "時制",
    difficulty: 4,
    sentence:
      "The client _____ for over an hour when the consultant finally arrived at the office.",
    choices: {
      A: "was waiting",
      B: "had been waiting",
      C: "has been waiting",
      D: "waited",
    },
    answer: "B",
    explanation:
      "過去の基準点（arrived）より前から続いていた動作には過去完了進行形 had been + -ing を使います。",
    choiceExplanations: {
      A: "was waiting は過去進行形で、継続期間（over an hour）と過去の基準点の関係を正確に表せません。",
      B: "had been waiting は過去完了進行形で、「コンサルタントが到着した時点まで1時間以上ずっと待っていた」という状況を正確に表します。",
      C: "has been waiting は現在完了進行形で、過去の文脈（arrived）と合いません。",
      D: "waited は過去形で、for over an hour という継続を示す表現との相性が悪く、完了進行形が自然です。",
    },
  },

  // ===== 前置詞 (4問) =====
  {
    id: 9,
    category: "前置詞",
    difficulty: 2,
    sentence:
      "The marketing team is responsible _____ developing and implementing promotional campaigns.",
    choices: {
      A: "of",
      B: "with",
      C: "for",
      D: "at",
    },
    answer: "C",
    explanation:
      "be responsible for ～（〜に責任がある）は固定表現です。for が正解です。",
    choiceExplanations: {
      A: "responsible of という表現は存在しません。",
      B: "responsible with という表現は一般的ではありません。",
      C: "be responsible for は「〜を担当している・責任がある」という意味の頻出表現です。",
      D: "responsible at という表現は文法的に不自然です。",
    },
  },
  {
    id: 10,
    category: "前置詞",
    difficulty: 2,
    sentence:
      "Please submit your expense report _____ the end of the business day on Friday.",
    choices: {
      A: "until",
      B: "by",
      C: "for",
      D: "during",
    },
    answer: "B",
    explanation:
      "締め切り（期限まで）を表すのは by です。by Friday の end of day = 金曜の終業時刻までに。",
    choiceExplanations: {
      A: "until は「〜まで（ずっと）」という継続を表します。「金曜終業時刻まで提出し続ける」という意味になり不自然です。",
      B: "by は「〜までに（期限）」を表し、「金曜の終業時刻までに提出してください」と正確に言えます。",
      C: "for は期間を表す前置詞で、期限の表現には使いません。",
      D: "during は「〜の間」で特定の期間内を指し、this context には合いません。",
    },
  },
  {
    id: 11,
    category: "前置詞",
    difficulty: 2,
    sentence:
      "The new conference room is located _____ the elevator and the main entrance.",
    choices: {
      A: "among",
      B: "between",
      C: "within",
      D: "across",
    },
    answer: "B",
    explanation:
      "2つのものの間には between を使います。「エレベーターとメインエントランスの間」が正解です。",
    choiceExplanations: {
      A: "among は3つ以上のものの間を表す前置詞で、2つのものには使いません。",
      B: "between は2つのものの間を表す前置詞で、2か所（elevator と main entrance）の間に正しく使えます。",
      C: "within は「〜の中に・範囲内に」を意味し、2点間の位置を表すのには不適切です。",
      D: "across は「〜を横切って・向かい側に」を意味し、文意に合いません。",
    },
  },
  {
    id: 12,
    category: "前置詞",
    difficulty: 3,
    sentence:
      "_____ the recent economic downturn, the company managed to increase its market share.",
    choices: {
      A: "Despite",
      B: "Because of",
      C: "Due to",
      D: "Owing to",
    },
    answer: "A",
    explanation:
      "「不況にもかかわらず、市場シェアを伸ばせた」という逆接の意味を表す Despite が正解です。",
    choiceExplanations: {
      A: "despite は「〜にもかかわらず」という逆接の前置詞で、「不況にもかかわらずシェアを伸ばした」という文意に一致します。",
      B: "because of は「〜のせいで・〜が原因で」という因果を表し、不況が原因でシェアが増えたという不自然な意味になります。",
      C: "due to も「〜が原因で」を意味し、because of と同様に文意と逆になります。",
      D: "owing to も「〜のために（原因）」を表し、B・C と同じ理由で不正解です。",
    },
  },

  // ===== 接続詞 (4問) =====
  {
    id: 13,
    category: "接続詞",
    difficulty: 3,
    sentence:
      "The construction will begin _____ all the necessary permits have been obtained from the city.",
    choices: {
      A: "as soon as",
      B: "in spite of",
      C: "regardless",
      D: "except",
    },
    answer: "A",
    explanation:
      "空欄の後に完全な節（SV）が続いているため、接続詞が必要です。as soon as（〜するとすぐに）が正解です。",
    choiceExplanations: {
      A: "as soon as は接続詞で「〜するとすぐに」を意味し、permits が取れたらすぐ建設開始という文意にぴったりです。",
      B: "in spite of は前置詞句で後ろに名詞（句）が来ます。節（SV）は続けられません。",
      C: "regardless は副詞で接続詞の役割を果たせません。regardless of + 名詞なら使えます。",
      D: "except は前置詞または接続詞ですが、「〜を除いて」という意味で文意に合いません。",
    },
  },
  {
    id: 14,
    category: "接続詞",
    difficulty: 3,
    sentence:
      "The budget was significantly reduced; _______, the team delivered the project on time and within scope.",
    choices: {
      A: "furthermore",
      B: "nevertheless",
      C: "in addition",
      D: "similarly",
    },
    answer: "B",
    explanation:
      "「予算削減にもかかわらず、期限内に納品した」という逆接の関係です。nevertheless（それにもかかわらず）が正解です。",
    choiceExplanations: {
      A: "furthermore は「さらに・加えて」という追加を表す接続副詞で、逆接の文脈には合いません。",
      B: "nevertheless は「それにもかかわらず」という逆接の接続副詞で、予算削減にもかかわらず成功したという対比を正しく表します。",
      C: "in addition は「加えて」で追加を表し、逆接になりません。",
      D: "similarly は「同様に」で比較・類似を表し、文意に合いません。",
    },
  },
  {
    id: 15,
    category: "接続詞",
    difficulty: 4,
    sentence:
      "_____ the proposal is approved by the board, the new division will be established by April.",
    choices: {
      A: "Provided that",
      B: "Despite",
      C: "Regardless of",
      D: "Even so",
    },
    answer: "A",
    explanation:
      "「提案が承認されるならば（条件）、部門を設立する」という条件を表す Provided that が正解です。",
    choiceExplanations: {
      A: "provided that は「〜という条件で・〜ならば」という条件接続詞で、後ろに節を取ります。この文意に完全に一致します。",
      B: "despite は逆接の前置詞で、後ろに名詞句が来ます。節は続けられません。",
      C: "regardless of は「〜に関わらず」という前置詞句で節を続けられず、文意も逆です。",
      D: "even so は「たとえそうでも」という副詞句で、文頭に節を導く接続詞の役割はありません。",
    },
  },
  {
    id: 16,
    category: "接続詞",
    difficulty: 4,
    sentence:
      "All attendees must register online in advance _____ they will not be admitted to the conference.",
    choices: {
      A: "so that",
      B: "unless",
      C: "otherwise",
      D: "or else",
    },
    answer: "C",
    explanation:
      "セミコロンの代わりに使う接続副詞として otherwise（さもなければ）が適切です。「事前登録しなければ入場できない」という意味です。",
    choiceExplanations: {
      A: "so that は「〜するために・〜するように」という目的を表し、文意と逆になります。",
      B: "unless は「〜でない限り」という条件接続詞で、節を導けますが、ここでは文中の位置とピリオドなしの構造上 otherwise が自然です。",
      C: "otherwise は接続副詞で「さもなければ」を意味し、「事前登録しないと入場できない」という結果・警告を表します。",
      D: "or else も「さもなければ」という意味ですが、2語で otherwise より口語的です。ただし文法的に正解の or else も機能します。TOEIC では otherwise が標準的。",
    },
  },

  // ===== 語彙 (4問) =====
  {
    id: 17,
    category: "語彙",
    difficulty: 2,
    sentence:
      "The company decided to _____ its product line to include more eco-friendly options.",
    choices: {
      A: "expand",
      B: "expend",
      C: "expense",
      D: "export",
    },
    answer: "A",
    explanation:
      "「製品ラインを拡大する」という文意です。expand（拡大する）が正解です。",
    choiceExplanations: {
      A: "expand は「拡大する・拡張する」という意味の動詞で、製品ラインの拡充に正しく使えます。",
      B: "expend は「（エネルギー・資金を）消費する・使い果たす」という意味で文意に合いません。",
      C: "expense は名詞（費用・経費）で、ここでは動詞が必要です。",
      D: "export は「輸出する」という意味で、製品ラインの拡充という文意には合いません。",
    },
  },
  {
    id: 18,
    category: "語彙",
    difficulty: 3,
    sentence:
      "Please _____ that all documents are properly signed before submitting them to the legal department.",
    choices: {
      A: "assure",
      B: "ensure",
      C: "insure",
      D: "ascertain",
    },
    answer: "B",
    explanation:
      "「〜を確かめる・確実にする」という文意で、that 節を目的語に取る ensure が正解です。",
    choiceExplanations: {
      A: "assure は「（人）に保証する・安心させる」で assure someone that ～ の形を取ります。目的語が人でないのでここでは不自然。",
      B: "ensure は「〜を確実にする・保証する」で ensure that 節 の形を正しく取ります。",
      C: "insure は「保険をかける」という意味で、ビジネス文書の確認手続きには使いません。",
      D: "ascertain は「〜を確かめる・調査する」という意味ですが、ascertain that は少々堅く、また日常的な指示文では ensure が自然です。",
    },
  },
  {
    id: 19,
    category: "語彙",
    difficulty: 3,
    sentence:
      "The board of directors has voted to _____ the CEO's contract for an additional three years.",
    choices: {
      A: "renew",
      B: "retrieve",
      C: "restore",
      D: "review",
    },
    answer: "A",
    explanation:
      "「契約を更新する」には renew（更新する）を使います。TOEIC 頻出表現です。",
    choiceExplanations: {
      A: "renew は「更新する・延長する」という意味で、contract の後に続けて「契約を更新する」と正しく言えます。",
      B: "retrieve は「取り戻す・検索する」という意味で、契約の更新には使いません。",
      C: "restore は「回復する・復元する」という意味で、契約の継続延長を表すには不適切です。",
      D: "review は「見直す・審査する」という意味で、renew（更新する）とは意味が異なります。",
    },
  },
  {
    id: 20,
    category: "語彙",
    difficulty: 4,
    sentence:
      "The new marketing strategy has proven highly _____ in attracting customers in the 18–35 age group.",
    choices: {
      A: "sufficient",
      B: "proficient",
      C: "effective",
      D: "efficient",
    },
    answer: "C",
    explanation:
      "「ターゲット層を引きつけるのに非常に効果的だった」という文意です。effective（効果的な）が正解です。",
    choiceExplanations: {
      A: "sufficient は「十分な」という意味で、「顧客を引きつけるのに十分な」とはニュアンスが異なります。",
      B: "proficient は「熟練した・堪能な」という意味で、人やスキルについて使うのが一般的です。",
      C: "effective は「効果的な」で、「目的（顧客獲得）を達成するのに有効」という文意に完全に合います。",
      D: "efficient は「効率的な」で、リソースを無駄なく使うという意味です。effective（目標達成）とは区別が必要です。",
    },
  },

  // ===== 品詞 セット2 (4問) =====
  {
    id: 21,
    category: "品詞",
    difficulty: 2,
    sentence:
      "The _____ of the contract was finalized after weeks of negotiation.",
    choices: {
      A: "settle",
      B: "settled",
      C: "settlement",
      D: "settling",
    },
    answer: "C",
    explanation:
      "The の後ろの主語位置には名詞が必要です。settlement（合意、決着）が正解です。",
    choiceExplanations: {
      A: "settle は動詞（解決する）で、主語位置に単独では使えません。",
      B: "settled は形容詞・過去分詞で、主語の名詞として不適切です。",
      C: "settlement は名詞（合意・解決）で、The settlement of the contract という主語句を正しく作れます。",
      D: "settling は動名詞・現在分詞で、of the contract と接続する場合、名詞 settlement の方が自然です。",
    },
  },
  {
    id: 22,
    category: "品詞",
    difficulty: 2,
    sentence:
      "A _____ response to customer inquiries is essential for maintaining good relationships.",
    choices: {
      A: "promptly",
      B: "promptness",
      C: "prompt",
      D: "prompted",
    },
    answer: "C",
    explanation:
      "空欄は名詞 response を修飾する形容詞が必要です。prompt（迅速な）が正解です。",
    choiceExplanations: {
      A: "promptly は副詞で、名詞を修飾することはできません。",
      B: "promptness は名詞（迅速さ）で、名詞を修飾する形容詞の代わりにはなりません。",
      C: "prompt は形容詞で、名詞 response を適切に修飾します。「迅速な対応」という意味になります。",
      D: "prompted は動詞の過去形・過去分詞で、形容詞的用法もありますが、ここでは prompt が自然です。",
    },
  },
  {
    id: 23,
    category: "品詞",
    difficulty: 3,
    sentence:
      "Please review the attached report _____ before the meeting starts.",
    choices: {
      A: "thorough",
      B: "thoroughly",
      C: "thoroughness",
      D: "thoroughed",
    },
    answer: "B",
    explanation:
      "空欄は動詞 review を修飾する副詞が必要です。thoroughly（徹底的に）が正解です。",
    choiceExplanations: {
      A: "thorough は形容詞（徹底的な）で、動詞を修飾することはできません。",
      B: "thoroughly は副詞で、動詞 review を修飾して「徹底的に見直す」という意味になります。",
      C: "thoroughness は名詞（徹底さ）で、副詞の役割は果たせません。",
      D: "thoroughed という語は存在しません。",
    },
  },
  {
    id: 24,
    category: "品詞",
    difficulty: 3,
    sentence:
      "The company's _____ in emerging markets has doubled over the past two years.",
    choices: {
      A: "invest",
      B: "investor",
      C: "investment",
      D: "invested",
    },
    answer: "C",
    explanation:
      "The company's の後ろには名詞が来ます。investment（投資）が正解です。",
    choiceExplanations: {
      A: "invest は動詞（投資する）で、所有格の後ろには名詞が必要です。",
      B: "investor は名詞（投資家）ですが、「会社の投資家が2倍になった」という意味になり不自然です。",
      C: "investment は名詞（投資）で、「会社の新興市場への投資が2倍になった」という文意に合います。",
      D: "invested は動詞の過去形・過去分詞で、主語位置には適切な名詞形が必要です。",
    },
  },

  // ===== 時制 セット2 (4問) =====
  {
    id: 25,
    category: "時制",
    difficulty: 3,
    sentence:
      "The research team _____ the data for three months when the funding was suddenly cut.",
    choices: {
      A: "was analyzing",
      B: "had been analyzing",
      C: "has analyzed",
      D: "analyzed",
    },
    answer: "B",
    explanation:
      "was suddenly cut という過去の出来事より前から継続していた動作には過去完了進行形を使います。",
    choiceExplanations: {
      A: "was analyzing は過去進行形で、継続期間 three months と過去の基準点の関係を正確に表せません。",
      B: "had been analyzing は過去完了進行形で、「資金が突然カットされた時点まで3ヶ月間ずっと分析していた」を正確に表します。",
      C: "has analyzed は現在完了形で、過去の文脈（was cut）と合いません。",
      D: "analyzed は単純過去形で、for three months という継続を示す表現との組み合わせで自然ではありません。",
    },
  },
  {
    id: 26,
    category: "時制",
    difficulty: 2,
    sentence:
      "The factory _____ its production capacity by 30% since the new equipment was installed.",
    choices: {
      A: "increases",
      B: "increased",
      C: "has increased",
      D: "will increase",
    },
    answer: "C",
    explanation:
      "since（〜以来）という現在完了の目印があります。has increased（現在完了）が正解です。",
    choiceExplanations: {
      A: "increases は現在形（三単現）で、since 節と組み合わせると不自然です。",
      B: "increased は過去形で、since という継続・完了を示す接続詞とは合いません。",
      C: "has increased は現在完了形で、「新設備が設置されて以来、生産能力が30%増加した（現在に至るまで）」を正確に表します。",
      D: "will increase は未来形で、since という過去起点の表現と矛盾します。",
    },
  },
  {
    id: 27,
    category: "時制",
    difficulty: 2,
    sentence: "The annual shareholders' meeting _____ at 10 a.m. next Tuesday.",
    choices: {
      A: "held",
      B: "is held",
      C: "will be held",
      D: "has been held",
    },
    answer: "C",
    explanation:
      "next Tuesday（来週火曜日）という未来の時間表現があります。will be held（未来受動態）が正解です。",
    choiceExplanations: {
      A: "held は過去形で、next Tuesday という未来の表現と矛盾します。",
      B: "is held は現在形（受動態）で、next Tuesday という未来の時間に使うのは不適切です。",
      C: "will be held は未来受動態で、「来週火曜日の午前10時に開催される予定」という意味を正確に表します。",
      D: "has been held は現在完了受動態で、過去の出来事を表し、next Tuesday という未来表現と合いません。",
    },
  },
  {
    id: 28,
    category: "時制",
    difficulty: 4,
    sentence:
      "By the end of this fiscal year, the company _____ in more than 50 countries worldwide.",
    choices: {
      A: "will operate",
      B: "operates",
      C: "will have operated",
      D: "has been operating",
    },
    answer: "C",
    explanation:
      "By the end of ～（未来の時点）までに完了する動作には未来完了形 will have + 過去分詞を使います。",
    choiceExplanations: {
      A: "will operate は単純未来で、「その時点までに完了している」という完了のニュアンスが不足しています。",
      B: "operates は現在形で、未来の時間表現 by the end of this fiscal year と合いません。",
      C: "will have operated は未来完了形で、「今会計年度末までに、50カ国以上で事業を展開しているだろう」と正確に表現できます。",
      D: "has been operating は現在完了進行形で、未来の時間表現には使えません。",
    },
  },

  // ===== 前置詞 セット2 (4問) =====
  {
    id: 29,
    category: "前置詞",
    difficulty: 2,
    sentence:
      "All employees must comply _____ the new workplace safety regulations.",
    choices: {
      A: "to",
      B: "with",
      C: "for",
      D: "about",
    },
    answer: "B",
    explanation:
      "comply with ～（〜に従う）は固定表現です。with が正解です。",
    choiceExplanations: {
      A: "comply to という表現は存在しません。comply は with と組み合わせます。",
      B: "comply with は「〜に従う・遵守する」という意味の重要な固定表現です。",
      C: "comply for という表現は一般的ではありません。",
      D: "comply about という表現は存在しません。",
    },
  },
  {
    id: 30,
    category: "前置詞",
    difficulty: 3,
    sentence:
      "The company acted _____ accordance with all applicable environmental regulations.",
    choices: {
      A: "on",
      B: "at",
      C: "in",
      D: "by",
    },
    answer: "C",
    explanation:
      "in accordance with ～（〜に従って）は固定表現です。in が正解です。",
    choiceExplanations: {
      A: "on accordance with という表現は存在しません。",
      B: "at accordance with という表現は存在しません。",
      C: "in accordance with は「〜に従って」という意味の頻出フレーズです。",
      D: "by accordance with という表現は一般的ではありません。",
    },
  },
  {
    id: 31,
    category: "前置詞",
    difficulty: 3,
    sentence:
      "Applicants must submit all required documents _____ to the interview.",
    choices: {
      A: "prior",
      B: "before",
      C: "ahead",
      D: "earlier",
    },
    answer: "A",
    explanation:
      "_____ to the interview という形から、prior to ～（〜の前に）という前置詞句が適切です。",
    choiceExplanations: {
      A: "prior to は「〜に先立って・〜の前に」という意味の前置詞句で、to を伴う形が正しく使えます。",
      B: "before は接続詞・前置詞ですが、before to という形では使いません。before the interview が正しい形です。",
      C: "ahead は副詞で ahead of the interview が正しい形です。ahead to という形は使いません。",
      D: "earlier は副詞・形容詞で、前置詞 to を伴う形では使いません。",
    },
  },
  {
    id: 32,
    category: "前置詞",
    difficulty: 2,
    sentence:
      "The training session is open to all staff members _____ their department or seniority.",
    choices: {
      A: "because of",
      B: "regardless of",
      C: "due to",
      D: "in spite",
    },
    answer: "B",
    explanation:
      "「部署や年功序列に関わらず、全スタッフに開放」という意味で regardless of（〜に関わらず）が正解です。",
    choiceExplanations: {
      A: "because of は「〜のせいで」という原因を表し、文意と逆になります。",
      B: "regardless of は「〜に関わらず・〜に左右されず」という意味で、全員参加可能という文意に合います。",
      C: "due to は「〜のせいで・〜が原因で」という因果を表し、文意に合いません。",
      D: "in spite は in spite of の形で使う必要があり、of が抜けているため不完全です。",
    },
  },

  // ===== 接続詞 セット2 (4問) =====
  {
    id: 33,
    category: "接続詞",
    difficulty: 3,
    sentence:
      "The new branch will be opened on schedule _____ the construction is completed without delay.",
    choices: {
      A: "as long as",
      B: "even though",
      C: "now that",
      D: "in case",
    },
    answer: "A",
    explanation:
      "「工事が遅延なく完了する限り（条件）、予定通りに開店する」という条件を表す as long as が正解です。",
    choiceExplanations: {
      A: "as long as は「〜する限り」という条件を表す接続詞で、「遅延なく工事が完了するという条件のもとで」という文意に合います。",
      B: "even though は「〜にもかかわらず」という逆接で、工事完了が条件になる文意と矛盾します。",
      C: "now that は「今や〜なので（既に起きたこと）」という理由・原因を表し、未来の条件には使いません。",
      D: "in case は「〜に備えて・〜の場合に」を意味し、ここでは条件ではなく備えの意味になります。",
    },
  },
  {
    id: 34,
    category: "接続詞",
    difficulty: 3,
    sentence:
      "_____ she has ten years of experience in the field, her application was shortlisted immediately.",
    choices: {
      A: "Despite",
      B: "However",
      C: "Since",
      D: "Unless",
    },
    answer: "C",
    explanation:
      "「10年の経験があるので（理由）、すぐに選ばれた」という因果関係を表す Since が正解です。",
    choiceExplanations: {
      A: "despite は逆接の前置詞で後に名詞句が来ます。節（SV）は続けられません。",
      B: "however は接続副詞で「しかしながら」という逆接を表し、文頭に節を導く接続詞としては使いません。",
      C: "since は接続詞として「〜なので（理由）」という因果を表し、節を導けます。",
      D: "unless は「〜でない限り」という条件（否定条件）を表し、文意と合いません。",
    },
  },
  {
    id: 35,
    category: "接続詞",
    difficulty: 4,
    sentence:
      "The report must be submitted by Monday, _____ the project timeline will be pushed back.",
    choices: {
      A: "so",
      B: "although",
      C: "whether",
      D: "otherwise",
    },
    answer: "D",
    explanation:
      "「月曜日までに提出しなければ（さもなければ）、プロジェクトが遅れる」という結果を表す otherwise が正解です。",
    choiceExplanations: {
      A: "so は「だから・そのために」という結果・目的を表し、「提出するから遅れる」という不自然な意味になります。",
      B: "although は「〜にもかかわらず」という逆接の接続詞で、文意に合いません。",
      C: "whether は「〜かどうか」という選択・疑問を表し、文意に合いません。",
      D: "otherwise は「さもなければ・そうでなければ」という条件の結果を表す接続副詞で、「提出しなければプロジェクトが遅れる」という文意に一致します。",
    },
  },
  {
    id: 36,
    category: "接続詞",
    difficulty: 4,
    sentence:
      "_____ the company has grown rapidly, it has maintained its commitment to quality.",
    choices: {
      A: "Because",
      B: "While",
      C: "Until",
      D: "Once",
    },
    answer: "B",
    explanation:
      "「急成長しているにもかかわらず（一方で）、品質への姿勢を維持」という対比を表す While が正解です。",
    choiceExplanations: {
      A: "because は理由を表し、「急成長したので品質を維持した」という文意になりますが、この対比の文脈では while が自然です。",
      B: "while は「〜する一方で・〜にもかかわらず」という対比・逆接の意味で使えます。急成長と品質維持という対比を表します。",
      C: "until は「〜するまで」という時間を表し、文意に合いません。",
      D: "once は「いったん〜すると」という条件・時間を表し、文意に合いません。",
    },
  },

  // ===== 語彙 セット2 (4問) =====
  {
    id: 37,
    category: "語彙",
    difficulty: 2,
    sentence:
      "The manager asked all team members to _____ their progress reports by the end of the week.",
    choices: {
      A: "submit",
      B: "subscribe",
      C: "substitute",
      D: "suppress",
    },
    answer: "A",
    explanation:
      "「報告書を提出する」には submit（提出する）を使います。TOEIC頻出表現です。",
    choiceExplanations: {
      A: "submit は「提出する・送信する」という意味で、progress reports を submit するという文意に完全に合います。",
      B: "subscribe は「購読する・登録する」という意味で、報告書の提出には使いません。",
      C: "substitute は「代替する・置き換える」という意味で、文意に合いません。",
      D: "suppress は「抑制する・隠す」という意味で、文意に合いません。",
    },
  },
  {
    id: 38,
    category: "語彙",
    difficulty: 3,
    sentence:
      "The company plans to _____ its operations to three new cities by the end of next year.",
    choices: {
      A: "extend",
      B: "expel",
      C: "exhaust",
      D: "expose",
    },
    answer: "A",
    explanation:
      "「事業を拡大・延伸する」には extend（拡大する）を使います。",
    choiceExplanations: {
      A: "extend は「拡大する・延長する」という意味で、operations を新都市に広げるという文意に合います。",
      B: "expel は「追い出す・除名する」という意味で、文意と合いません。",
      C: "exhaust は「消耗させる・使い果たす」という意味で、文意に合いません。",
      D: "expose は「さらす・露出させる」という意味で、文意に合いません。",
    },
  },
  {
    id: 39,
    category: "語彙",
    difficulty: 3,
    sentence:
      "The finance team will _____ the project costs after reviewing the updated budget proposal.",
    choices: {
      A: "assess",
      B: "access",
      C: "accept",
      D: "accord",
    },
    answer: "A",
    explanation:
      "「費用を評価・査定する」には assess（評価する）を使います。",
    choiceExplanations: {
      A: "assess は「評価する・査定する」という意味で、project costs を assess するという文意に合います。",
      B: "access は「アクセスする・入手する」という意味で、費用を評価するという文脈には合いません。",
      C: "accept は「受け入れる・承認する」という意味で、コスト評価には使いません。",
      D: "accord は「一致する・与える」という意味で、文意に合いません。",
    },
  },
  {
    id: 40,
    category: "語彙",
    difficulty: 4,
    sentence:
      "The CEO's speech was intended to _____ employees' confidence during the corporate restructuring.",
    choices: {
      A: "boost",
      B: "block",
      C: "burden",
      D: "breach",
    },
    answer: "A",
    explanation:
      "「社員の自信を高める・後押しする」には boost（高める、後押しする）を使います。",
    choiceExplanations: {
      A: "boost は「高める・後押しする」という意味で、confidence を boost するという文意に完全に合います。TOEIC頻出語です。",
      B: "block は「妨げる・ブロックする」という意味で、文意と逆になります。",
      C: "burden は「重荷を負わせる」という意味で、文意に合いません。",
      D: "breach は「違反する・破る」という意味で、文意に合いません。",
    },
  },
];

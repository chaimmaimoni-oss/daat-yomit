/* דעת יומית — גרסה עצמאית: הכל רץ בדפדפן, הנתונים נשמרים ב-localStorage. */
(function () {
  'use strict';

  /* ======================================================================
     קבועים
     ====================================================================== */
  const KEY = 'daat-yomit-v1';
  const DOMAINS = {
    philosophy: 'פילוסופיה', economics: 'כלכלה', history: 'היסטוריה', politics: 'מדע המדינה',
    geopolitics: 'גאופוליטיקה ודיפלומטיה', rhetoric: 'רטוריקה ושכנוע', critical: 'חשיבה ביקורתית',
    psychology: 'פסיכולוגיה ומנהיגות', science: 'מדע וטכנולוגיה', jewish: 'מחשבת ישראל',
    stats: 'אוריינות סטטיסטית', current: 'אקטואליה'
  };
  const HEB_MONTHS = { Tishri: 'תשרי', Heshvan: 'חשוון', Kislev: 'כסלו', Tevet: 'טבת', Shevat: 'שבט', 'Adar I': 'אדר א׳', Adar: 'אדר', 'Adar II': 'אדר ב׳', Nisan: 'ניסן', Iyar: 'אייר', Sivan: 'סיוון', Tamuz: 'תמוז', Av: 'אב', Elul: 'אלול' };
  /* מרווחי חזרה (בימים). "קל" דוחה ל-5 חודשים לפחות; כל דירוג אחר מחזיר לתור רק בעוד חודש לפחות. */
  const EASY_DAYS = [150, 240, 365];     /* קל: פעם ראשונה 5 חודשים, אחר כך 8 חודשים, ואז שנה */
  const MEDIUM_DAYS = [45, 60, 90];      /* הבנתי / בינוני: חודש וחצי, חודשיים, 3 חודשים */
  const HARD_DAYS = 30;                  /* קשה: חודש */
  const NEW_ITEM_DAYS = 30;              /* פריט שלא דורג נכנס לתור בעוד חודש */
  const STATUS_OF = { easy: 'easy', medium: 'understood', hard: 'hard' };
  const SCORE = { easy: 1, good: 0.6, medium: 0.6, hard: 0 };
  const SESSION_MAX = 25;

  /* ======================================================================
     תוכן מובנה — יום 1. ימים נוספים נכנסים דרך "ייבוא תדריך יומי" בהגדרות.
     ====================================================================== */
  const CONTENT = {
    days: [{
      date: '2026-10-25',
      topic: 'יומיים לבחירות: איך פועלת הדמוקרטיה, ומה מונח על הכף',
      intro: 'ביום שלישי, 27 באוקטובר, ישראל הולכת לבחירות לכנסת ה-26. התדריך עוסק במנגנון הבחירות, בשאלה כלכלית שעלתה השבוע לסדר היום, ובשאלה העתיקה מהו מקור הלגיטימציה של מנהיג.'
    }],
    extras: [{
      date: '2026-10-25',
      model: {
        title: 'השלכות מסדר שני',
        body: 'כל החלטה מולידה תוצאה ישירה, ואחריה תוצאות של התוצאה. השאלה שיש לשאול תמיד: "ואחר כך מה?"\nדוגמה קלאסית: פיקוח על שכר דירה. התוצאה הראשונה היא דירות זולות לשוכרים של היום. התוצאה השנייה: פחות משתלם לבנות ולהשכיר, ההיצע מצטמצם, ושוכרי המחר מתקשים למצוא דירה.\nחז"ל ניסחו זאת בקיצור: "איזהו חכם? הרואה את הנולד" (תמיד ל״ב ע״א). מנהיג נבחן לא במה שהחלטתו פותרת מחר בבוקר, אלא במה שהיא מולידה בעוד שנה.'
      },
      question: 'מה חשוב יותר במנהיג: יכולת ביצוע או אמינות אישית? ואם היית נדרש לוותר על אחת מהן, על איזו היית מוותר, ומדוע?',
      challenge: 'הסבר בקול, בתוך דקה, לאדם שאינו מתמצא בפוליטיקה, כיצד מתחלקים 120 המושבים. כלול את אחוז החסימה, את הסכמי העודפים, ומדוע נדרשים 61.\nעצה: פתח בדוגמה ("מפלגה עם 3% אינה נכנסת כלל"), ורק אחר כך הצג את הכלל.'
    }],
    items: [
      {
        id: '2026-10-25-k1', date: '2026-10-25', type: 'knowledge', order: 1, domain: 'politics',
        title: 'כיצד מתחלקים 120 המושבים',
        question: 'כמה מושבים שווה אחוז החסימה, ומהו הסכם עודפים?',
        content: 'בישראל המדינה כולה היא אזור בחירה אחד. מצביעים לרשימה סגורה של מפלגה, לא למועמד. כל רשימה שעוברת את אחוז החסימה, 3.25% מהקולות הכשרים, מקבלת מושבים לפי חלקה היחסי בקולות.\nבפועל, אחוז החסימה שווה לכארבעה מושבים. רשימה שמקבלת 3% אינה מקבלת אף מושב, וקולותיה הולכים לאיבוד.\nהמושבים שנותרים אחרי החלוקה הראשונה מחולקים בשיטת באדר-עופר, הנוטה מעט לטובת רשימות גדולות. שתי רשימות רשאיות לחתום על הסכם עודפים, וכך הקולות שנותרו להן נספרים יחד בחלוקת המושבים האחרונים.\nכדי להקים ממשלה נדרשים 61 מושבים. אף מפלגה לא זכתה בכך לבדה מאז קום המדינה, ולכן כל ממשלה בישראל היא קואליציה.',
        why: 'מי שמבין את המנגנון מבין את ההתנהגות: מדוע מפלגות מתאחדות לפני בחירות, מדוע מדברים על "קולות שנשרפים", ומדוע ההכרעה נופלת לעיתים רק במושבים האחרונים.',
        how: 'כשנאמר "המפלגה קיבלה 3% בסקר", תרגם מיד: אפס מושבים, וקולות שאינם נספרים לאף גוש. נתון כזה עשוי להכריע את היחס בין הגושים.'
      },
      {
        id: '2026-10-25-k2', date: '2026-10-25', type: 'knowledge', order: 2, domain: 'economics',
        title: 'כסף הוא אמון: מדוע קשה לעקוף סנקציות פיננסיות',
        question: 'מדוע קשה לעקוף סנקציה פיננסית, גם באמצעות מטבעות קריפטו?',
        content: 'כמעט כל העברה בינלאומית עוברת דרך בנקים מתווכים בחו"ל, הנקראים בנקים קורספונדנטים. הם מחזיקים חשבונות זה אצל זה וסומכים זה על זה. סנקציה פיננסית פועלת בדיוק בנקודה הזאת: היא גורמת לבנקים אלה לחדול מעבודה עם הבנקים של המדינה הנפגעת.\nהשבוע עלה הנושא לדיון בישראל. ראש הממשלה אמר כי יש להיערך לסנקציות אפשריות על מערכת הבנקאות ולשקול שימוש בבלוקצ\'יין כדי לעקוף אותן. בנק ישראל דחה את הרעיון וקבע כי מטבעות קריפטו אינם דרך לעקוף סנקציות. קבוצה של 109 כלכלנים, מנהלים ובכירים לשעבר הזהירה מפגיעה בהשקעות, בתעסוקה, בתשלומים ובאספקה.\nהבעיה העקרונית: גם מי שמחזיק קריפטו נדרש בסופו של דבר להמיר אותו לכסף רגיל כדי לשלם משכורות, לרכוש סחורה ולייבא תרופות. ההמרה הזאת עוברת דרך מוסדות מפוקחים, ושם הסנקציה פוגשת אותו שוב.',
        why: 'זו אחת השאלות הכלכליות המרכזיות בשיח הנוכחי. ההבנה שהמערכת הפיננסית נשענת על אמון בין מוסדות מאפשרת לשפוט כל הצעה בתחום, מכל צד שהיא באה.',
        how: 'בדיון על הנושא שאל שאלה אחת: "היכן נקודת ההמרה לכסף רגיל, ומי שולט בה?" שאלה זו מבחינה בין פתרון ממשי לסיסמה.'
      },
      {
        id: '2026-10-25-k3', date: '2026-10-25', type: 'knowledge', order: 3, domain: 'history',
        title: 'המהפך של 1977',
        question: 'מה אירע בבחירות 1977, ואילו גורמים הביאו לכך?',
        content: 'במשך 29 שנה, מקום המדינה, שלטה בישראל תנועת העבודה: מפא"י ואחריה המערך. במאי 1977 הסתיימה תקופה זו. הליכוד בראשות מנחם בגין זכה ב-43 מושבים, והמערך ירד ל-32. בגין, שהפסיד בשמונה מערכות בחירות קודמות, נעשה ראש הממשלה.\nכמה גורמים חברו יחד: משבר האמון שאחרי מלחמת יום הכיפורים, פרשות שחיתות בצמרת, ותחושת קיפוח עמוקה בקרב יוצאי ארצות המזרח. מפלגה חדשה, ד"ש, נטלה 15 מושבים, רובם מבוחרים לשעבר של המערך.\nהקריין חיים יבין פתח את שידור התוצאות במילה "מהפך", והמילה נקלטה בשפה העברית.',
        why: 'אלה היו חילופי השלטון הראשונים בישראל, והם הוכיחו שהדמוקרטיה הישראלית מסוגלת להעביר שלטון בשלום. הם גם מלמדים ששלטון הנראה נצחי עשוי להתחלף כאשר כמה משברים מצטברים יחד.',
        how: 'כשנאמר "זה לעולם לא ישתנה", 1977 היא דוגמה חזקה. השאלה הנבונה אינה "האם", אלא "אילו תנאים צריכים להצטבר".'
      },
      {
        id: '2026-10-25-k4', date: '2026-10-25', type: 'knowledge', order: 4, domain: 'philosophy',
        title: 'אפלטון ומשל הספינה',
        question: 'מה טוען אפלטון במשל הספינה, ומה משיבה לו ההגות הדמוקרטית?',
        content: 'בספר "המדינה" מתאר אפלטון ספינה שבעליה חזק, אך כבד שמיעה, קצר ראייה, ואינו מבין בניווט. המלחים מתקוטטים על השליטה בהגה. איש מהם לא למד ניווט, וכולם טוענים שאין בכך צורך כלל. את הנווט האמיתי, המכיר את הכוכבים והרוחות, הם מכנים "רואה כוכבים" ואינם סופרים אותו.\nזו ביקורת חריפה על הדמוקרטיה: ההמון בוחר במי שמשכנע, לא במי שמבין. תשובתו של אפלטון הייתה שלטון הפילוסופים.\nההגות הדמוקרטית שבאה אחריו השיבה אחרת: אין אדם, ואפילו המומחה המעולה ביותר, הראוי לכוח בלא פיקוח. לכן נדרשים בחירות חוזרות, הפרדת רשויות ומוסדות המגבילים את השלטון.',
        why: 'המתח בין מומחיות לבין הסכמה ציבורית עומד ביסוד ויכוחים רבים כיום: מי מכריע, נבחרי הציבור או אנשי המקצוע.',
        how: 'בדיון על "מי צריך להכריע", הצג את שני הצדדים: הדמוקרטיה זקוקה למומחים כדי שלא תטבע, והמומחים זקוקים לפיקוח ציבורי כדי שלא ישתלטו.'
      },
      {
        id: '2026-10-25-k5', date: '2026-10-25', type: 'knowledge', order: 5, domain: 'stats',
        title: 'כמה מושבים יש באמת בסקר',
        question: 'בסקר של 500 משיבים, עד כמה מושבים עשויה להגיע הטעות לכל כיוון?',
        content: 'סקר בחירות שואל בדרך כלל 500 עד 700 איש, ולכל סקר כזה יש טעות דגימה. בסקר של 500 משיבים, מפלגה שמקבלת 25% עשויה בפועל לעמוד בכל מקום שבין 21% ל-29%, ברמת ביטחון של 95%. זהו טווח של כארבעה עד חמישה מושבים לכל כיוון.\nלכן מפלגה שעולה במושב אחד בין סקר לסקר אינה בהכרח מתחזקת. ייתכן שזה רעש סטטיסטי בלבד.\nמעבר לטעות הדגימה יש גורמים שהחישוב אינו מודד: מי יגיע בפועל להצביע, מי אינו משיב לסוקרים, ומי אינו אומר את האמת.',
        why: 'סקרים מעצבים את השיח, את האסטרטגיה של המפלגות ואף את החלטות המצביעים. מי שקורא אותם נכון אינו נגרר אחר כל כותרת.',
        how: 'במקום לשאול "כמה קיבלה המפלגה בסקר?", שאל "מה המגמה לאורך כמה סקרים?". ממוצע של כמה סקרים אמין בהרבה מכל סקר בודד.'
      },
      {
        id: '2026-10-25-k6', date: '2026-10-25', type: 'knowledge', order: 6, domain: 'rhetoric',
        title: 'אתוס, פתוס, לוגוס',
        question: 'מהם שלושת אמצעי השכנוע של אריסטו?',
        content: 'לפני כ-2,300 שנה זיהה אריסטו שלוש דרכים לשכנע. אתוס: אמינות הדובר, מדוע ראוי לסמוך עליו. פתוס: הרגש שהדברים מעוררים בקהל, פחד, תקווה, גאווה או כעס. לוגוס: ההיגיון, העובדות והטיעונים עצמם.\nנאום חזק משלב את שלושתם. נאום הנשען על פתוס בלבד עשוי לסחוף, אך הוא מתפרק כאשר בוחנים אותו. נאום הנשען על לוגוס בלבד עשוי להיות צודק, ובכל זאת לא להזיז איש.',
        why: 'בתקופת בחירות כל תשדיר, נאום ופוסט הם תרגיל בשכנוע. מי שמזהה את הכלים קשה יותר לתמרן אותו, והוא עצמו משכנע טוב יותר.',
        how: 'בתשדיר הבא שתראה שאל: על מה הוא נשען, על אמינות, על רגש או על עובדות? וכשאתה מכין נאום, ודא שיש בו את שלושתם.'
      },
      {
        id: '2026-10-25-k7', date: '2026-10-25', type: 'knowledge', order: 7, domain: 'jewish',
        title: '"הגון עליכם בצלאל?"',
        question: 'מה למד רבי יצחק מהשאלה "הגון עליכם בצלאל?"',
        content: 'הגמרא במסכת ברכות (נה ע"א) מספרת שהקב"ה אמר למשה שבצלאל יבנה את המשכן, ושאל אותו: "הגון עליך בצלאל?" השיב משה שאם בצלאל הגון לפני הקב"ה, קל וחומר שהוא הגון לפניו. ואף על פי כן נאמר לו ללכת ולשאול את העם. משה שאל את ישראל, והם השיבו אותה תשובה.\nמכאן למד רבי יצחק כלל: "אין מעמידין פרנס על הציבור אלא אם כן נמלכין בציבור". כלומר, אין ממנים מנהיג בלא היוועצות בציבור.\nהחידוש: גם כשהבחירה נכונה, וגם כשהיא באה מן המקור המוסמך ביותר, הלגיטימציה של מנהיג נבנית מהסכמת הציבור.',
        why: 'זהו עיקרון מנהיגות עתיק ועכשווי מאוד. סמכות שאינה נשענת על אמון הציבור היא סמכות חלשה, גם כשהיא צודקת.',
        how: 'כמנהיג, לפני החלטה גדולה, היוועץ גם כשאתה בטוח בתשובה. ההיוועצות עצמה בונה את נכונותם של אנשים ללכת אחריך.'
      },
      {
        id: '2026-10-25-e1', date: '2026-10-25', type: 'english', order: 1, domain: 'psychology',
        title: 'articulate a coherent vision',
        en: 'A leader who cannot articulate a coherent vision will struggle to command the loyalty of those he seeks to lead.',
        he: 'מנהיג שאינו מסוגל לנסח חזון מגובש יתקשה לזכות בנאמנותם של אלה שהוא מבקש להוביל.',
        keyword: 'articulate a coherent vision', keywordHe: 'לנסח חזון מגובש וברור',
        example: 'Before asking for sacrifice, a statesman must articulate a coherent vision of what it will achieve.',
        exampleHe: 'לפני שהוא דורש הקרבה, מדינאי חייב לנסח חזון מגובש של מה שהיא תשיג.'
      },
      {
        id: '2026-10-25-e2', date: '2026-10-25', type: 'english', order: 2, domain: 'rhetoric',
        title: 'appeal to reason',
        en: 'The most persuasive orators appeal to reason without neglecting the emotions that ultimately move an audience to act.',
        he: 'הנואמים המשכנעים ביותר פונים אל ההיגיון, מבלי להזניח את הרגשות שבסופו של דבר מניעים קהל לפעולה.',
        keyword: 'appeal to reason', keywordHe: 'לפנות אל ההיגיון',
        example: 'His speech was admired because it appealed to reason rather than to fear.',
        exampleHe: 'נאומו זכה להערכה משום שפנה אל ההיגיון ולא אל הפחד.'
      },
      {
        id: '2026-10-25-e3', date: '2026-10-25', type: 'english', order: 3, domain: 'geopolitics',
        title: 'reciprocated',
        en: 'Seasoned diplomats know that a concession offered too early is seldom reciprocated.',
        he: 'דיפלומטים ותיקים יודעים שוויתור שניתן מוקדם מדי נענה לעיתים רחוקות בוויתור שכנגד.',
        keyword: 'reciprocated', keywordHe: 'נענה בהדדיות, זוכה לגמול',
        example: 'Goodwill that is never reciprocated soon hardens into suspicion.',
        exampleHe: 'רצון טוב שאינו זוכה לגמול הופך במהרה לחשדנות.'
      },
      {
        id: '2026-10-25-e4', date: '2026-10-25', type: 'english', order: 4, domain: 'philosophy',
        title: 'flatter the crowd',
        en: 'Plato feared that democracy would reward those who flatter the crowd rather than those who possess genuine wisdom.',
        he: 'אפלטון חשש שהדמוקרטיה תתגמל את מי שמחניף להמון, ולא את מי שיש בו חוכמה אמיתית.',
        keyword: 'flatter the crowd', keywordHe: 'להחניף להמון',
        example: 'A true leader tells the public hard truths instead of trying to flatter the crowd.',
        exampleHe: 'מנהיג אמיתי אומר לציבור אמיתות קשות במקום להחניף להמון.'
      },
      {
        id: '2026-10-25-e5', date: '2026-10-25', type: 'english', order: 5, domain: 'psychology',
        title: 'abdication of responsibility',
        en: 'Delegating authority is not an abdication of responsibility; the leader remains accountable for the outcome.',
        he: 'האצלת סמכות איננה התנערות מאחריות; המנהיג נשאר אחראי לתוצאה.',
        keyword: 'abdication of responsibility · accountable', keywordHe: 'התנערות מאחריות · נושא באחריות',
        example: 'Blaming one\'s advisers after a failure is an abdication of responsibility.',
        exampleHe: 'הטלת האשמה על היועצים אחרי כישלון היא התנערות מאחריות.'
      },
      {
        id: '2026-10-25-e6', date: '2026-10-25', type: 'english', order: 6, domain: 'politics',
        title: 'forge a coalition',
        en: 'Whoever emerges with the mandate to form a government will have to forge a coalition out of deeply divergent interests.',
        he: 'מי שיקבל את המנדט להרכיב ממשלה ייאלץ ליצוק קואליציה מתוך אינטרסים שונים בתכלית.',
        keyword: 'forge a coalition · divergent', keywordHe: 'ליצוק קואליציה · שונים, מנוגדים',
        example: 'It takes patience and trust to forge a coalition that will survive its first crisis.',
        exampleHe: 'נדרשים סבלנות ואמון כדי ליצוק קואליציה שתשרוד את המשבר הראשון שלה.'
      },
      {
        id: '2026-10-25-e7', date: '2026-10-25', type: 'english', order: 7, domain: 'critical',
        title: 'substantive rebuttal',
        en: 'Each camp accused the other of fearmongering, yet neither offered a substantive rebuttal of the other\'s arguments.',
        he: 'כל מחנה האשים את משנהו בזריעת פחד, אך איש מהם לא הציע הפרכה עניינית לטיעוני הצד השני.',
        keyword: 'substantive rebuttal · fearmongering', keywordHe: 'הפרכה עניינית · זריעת פחד',
        example: 'An insult is not a substantive rebuttal; it is an admission that one has none.',
        exampleHe: 'עלבון אינו הפרכה עניינית; הוא הודאה שאין כזו.'
      },
      {
        id: '2026-10-25-e8', date: '2026-10-25', type: 'english', order: 8, domain: 'jewish',
        title: 'decreed',
        en: 'Legitimacy cannot be decreed from above; it must be earned through consultation and consent.',
        he: 'לגיטימציה אי אפשר לגזור מלמעלה; יש לקנות אותה בהיוועצות ובהסכמה.',
        keyword: 'decreed · consent', keywordHe: 'נגזר, נקבע בצו · הסכמה',
        example: 'Authority without consent is mere power, not legitimacy.',
        exampleHe: 'סמכות בלא הסכמה היא כוח בלבד, ולא לגיטימציה.'
      }
    ],
    quotes: [
      { id: '2026-10-25-q1', date: '2026-10-25', domain: 'jewish', text: 'אין מעמידין פרנס על הציבור אלא אם כן נמלכין בציבור.', source: 'רבי יצחק, תלמוד בבלי, ברכות נה ע"א', note: 'מתאים לפתיחת דברים על מנהיגות, אמון והיוועצות.' },
      { id: '2026-10-25-q2', date: '2026-10-25', domain: 'politics', text: 'Democracy is the worst form of Government except for all those other forms that have been tried from time to time.', source: 'וינסטון צ\'רצ\'יל, בית הנבחרים, 1947', note: 'בתרגום חופשי: הדמוקרטיה היא שיטת הממשל הגרועה ביותר, חוץ מכל השיטות האחרות שנוסו. צ\'רצ\'יל עצמו הציג זאת כאמירה ששמע מאחרים.' },
      { id: '2026-10-25-q3', date: '2026-10-25', domain: 'jewish', text: 'איזהו חכם? הרואה את הנולד.', source: 'תלמוד בבלי, תמיד לב ע"א', note: 'יסוד לחשיבה על השלכות מסדר שני ולתכנון ארוך טווח.' }
    ],
    weekly: [{
      week: '2026-10-25', weekEnd: '2026-10-31', title: 'שבוע 1', partial: true,
      note: 'הסיכום המלא של השבוע יתווסף ביום שישי. בינתיים, חידון קצר על מה שנלמד עד כה.',
      ideas: [
        { domain: 'politics', title: 'אחוז החסימה שווה כארבעה מושבים', text: 'רשימה שאינה עוברת 3.25% אינה נכנסת לכנסת, וקולותיה אינם נספרים לאף גוש.' },
        { domain: 'economics', title: 'סנקציות נפגשות בנקודת ההמרה', text: 'כל כסף חלופי צריך בסוף להפוך לכסף רגיל, ושם עומדים המוסדות המפוקחים.' },
        { domain: 'history', title: '1977: השלטון שנראה נצחי התחלף', text: 'כמה משברים שהצטברו יחד הביאו למהפך הראשון ולחילופי שלטון בשלום.' },
        { domain: 'stats', title: 'מושב אחד בסקר הוא רעש', text: 'בסקר של 500 משיבים הטעות עשויה להגיע לארבעה עד חמישה מושבים לכל כיוון. מסתכלים על מגמה.' },
        { domain: 'jewish', title: 'לגיטימציה נבנית בהיוועצות', text: '"אין מעמידין פרנס על הציבור אלא אם כן נמלכין בציבור": גם בחירה נכונה טעונה הסכמת הציבור.' }
      ],
      quiz: [
        { q: 'מהו אחוז החסימה בבחירות לכנסת?', options: ['2%', '3.25%', '5%', '61 מושבים'], answer: 1, explain: '3.25% מהקולות הכשרים, שהם כארבעה מושבים.' },
        { q: 'מה עושה הסכם עודפים?', options: ['מאחד שתי רשימות לרשימה אחת', 'מצרף את הקולות העודפים של שתי רשימות בחלוקת המושבים האחרונים', 'מוריד את אחוז החסימה לשתי הרשימות', 'קובע מי ירכיב את הממשלה'], answer: 1, explain: 'הקולות שנותרו לשתי הרשימות נספרים יחד, וכך גדל הסיכוי לזכות במושב נוסף.' },
        { q: 'באיזו שנה אירע המהפך הראשון בישראל?', options: ['1967', '1973', '1977', '1992'], answer: 2, explain: 'במאי 1977 זכה הליכוד בראשות מנחם בגין ב-43 מושבים.' },
        { q: 'לפי אריסטו, מהו "פתוס"?', options: ['אמינות הדובר', 'ההיגיון והעובדות', 'הרגש שהדברים מעוררים בקהל', 'מבנה הנאום'], answer: 2, explain: 'אתוס הוא אמינות, לוגוס הוא היגיון, ופתוס הוא רגש.' },
        { q: 'Which word means "נענה בהדדיות, זוכה לגמול"?', options: ['reciprocated', 'decreed', 'articulated', 'flattered'], answer: 0, ltr: true, explain: 'A concession offered too early is seldom reciprocated.' },
        { q: 'בסקר של 500 משיבים מפלגה עלתה במושב אחד. מהי המסקנה הנכונה?', options: ['היא מתחזקת בבירור', 'השינוי כנראה בתוך טווח הטעות', 'הסקר שגוי', 'היא בוודאי תעבור את אחוז החסימה'], answer: 1, explain: 'הטעות בסקר כזה עשויה להגיע לכמה מושבים, ולכן מושב אחד הוא בדרך כלל רעש.' }
      ]
    }]
  };

  /* כיווני העמקה ומקורות לנקודות הידע של יום 1 */
  const DEEPEN = {
    '2026-10-25-k1': { directions: ['כיצד פועלת שיטת באדר-עופר בפועל, ומדוע היא מטיבה עם הרשימות הגדולות', 'השוואה לשיטה האזורית בבריטניה: מה מרוויחים ומה מפסידים'], sources: ['חוק הבחירות לכנסת [נוסח משולב], התשכ"ט-1969', 'אתר ועדת הבחירות המרכזית: הסבר על חלוקת המנדטים'] },
    '2026-10-25-k2': { directions: ['מעמדו של הדולר ומערכת התשלומים הבינלאומית כמקור כוחן של סנקציות', 'מקרי המבחן של איראן ושל רוסיה: מה עבד ומה לא'], sources: ['Juan Zarate, Treasury\'s War (2013)', 'פרסומי בנק ישראל בנושא יציבות פיננסית'] },
    '2026-10-25-k3': { directions: ['תפקידה של ד"ש בראשות יגאל ידין בהכרעת 1977', 'הסכם השלום עם מצרים כציון דרך של שנות בגין'], sources: ['מרכז מורשת מנחם בגין: ארכיון ופרסומים'] },
    '2026-10-25-k4': { directions: ['משפט סוקרטס כרקע לביקורתו של אפלטון על הדמוקרטיה', 'קרל פופר כתגובה מודרנית לאפלטון'], sources: ['אפלטון, "המדינה", ספר ו\'', 'קרל פופר, "החברה הפתוחה ואויביה", כרך א\''] },
    '2026-10-25-k5': { directions: ['מהו מדגם מייצג, ומהן הטיות אי-השבה', 'כיצד בונים ממוצע סקרים משוקלל'], sources: ['Nate Silver, The Signal and the Noise (2012)'] },
    '2026-10-25-k6': { directions: ['כיצד משולבים אתוס, פתוס ולוגוס בנאום גטיסבורג של לינקולן', 'מקומו של האתוס בדברי הנביאים: סמכות הנבנית מיושר'], sources: ['אריסטו, "הרטוריקה", ספר א\''] },
    '2026-10-25-k7': { directions: ['עצת יתרו למשה: מנהיגות מבוזרת ושרי אלפים ומאות (שמות יח, יג-כו)', 'אצילת הרוח על שבעים הזקנים (במדבר יא, טז-יז)'], sources: ['תלמוד בבלי, ברכות נה ע"א', 'שמות, פרק יח'] }
  };
  CONTENT.items.forEach(i => { if (DEEPEN[i.id]) i.deepen = DEEPEN[i.id]; });

  /* פירוש מילה במילה למשפטי האנגלית של יום 1. תבנית: מילה=פירוש|מילה=פירוש */
  const GLOSS = {
    '2026-10-25-e1': 'A=(סתמי)|leader=מנהיג|who=אשר|cannot=אינו יכול|articulate=לנסח|a=(סתמי)|coherent=מגובש, עקבי|vision=חזון|will=(סימן עתיד)|struggle=להתקשות|to=(ל־)|command=לזכות ב־, לפקד על|the=ה־|loyalty=נאמנות|of=של|those=אלה|he=הוא|seeks=מבקש|to=(ל־)|lead=להוביל',
    '2026-10-25-e2': 'The=ה־|most=ביותר|persuasive=משכנעים|orators=נואמים|appeal=פונים|to=אל|reason=היגיון|without=בלי|neglecting=להזניח|the=ה־|emotions=רגשות|that=ש־|ultimately=בסופו של דבר|move=מניעים|an=(סתמי)|audience=קהל|to=(ל־)|act=לפעול',
    '2026-10-25-e3': 'Seasoned=ותיקים, מנוסים|diplomats=דיפלומטים|know=יודעים|that=ש־|a=(סתמי)|concession=ויתור|offered=שהוצע|too=מדי|early=מוקדם|is=(הוא)|seldom=לעיתים רחוקות|reciprocated=נענה בהדדיות',
    '2026-10-25-e4': 'Plato=אפלטון|feared=חשש|that=ש־|democracy=הדמוקרטיה|would=(עתיד מנקודת מבט של עבר)|reward=תתגמל|those=את אלה|who=אשר|flatter=מחניפים|the=ה־|crowd=המון|rather than=ולא, במקום|those=אלה|who=אשר|possess=מחזיקים, יש להם|genuine=אמיתית|wisdom=חוכמה',
    '2026-10-25-e5': 'Delegating=האצלת|authority=סמכות|is=היא|not=אינה|an=(סתמי)|abdication=התנערות, ויתור|of=על, מ־|responsibility=אחריות|the=ה־|leader=מנהיג|remains=נשאר|accountable=אחראי, חייב בדין וחשבון|for=על|the=ה־|outcome=תוצאה',
    '2026-10-25-e6': 'Whoever=מי ש־|emerges=יוצא, מתברר|with=עם|the=ה־|mandate=מנדט, ייפוי כוח|to=(ל־)|form=להרכיב|a=(סתמי)|government=ממשלה|will have to=ייאלץ|forge=ליצוק, לחשל|a=(סתמי)|coalition=קואליציה|out of=מתוך|deeply=עמוקות, בתכלית|divergent=שונים, מתפצלים|interests=אינטרסים',
    '2026-10-25-e7': 'Each=כל|camp=מחנה|accused=האשים|the=ה־|other=אחר, שני|of=ב־|fearmongering=זריעת פחד|yet=אך, ובכל זאת|neither=אף אחד מהשניים לא|offered=הציע|a=(סתמי)|substantive=עניינית, מהותית|rebuttal=הפרכה|of=של|the=ה־|other\'s=של האחר|arguments=טיעונים',
    '2026-10-25-e8': 'Legitimacy=לגיטימציה|cannot=אי אפשר|be=(להיות)|decreed=להיגזר בצו|from=מ־|above=למעלה|it=היא|must=חייבת|be=(להיות)|earned=נקנית, מושגת ביושר|through=באמצעות|consultation=היוועצות|and=ו־|consent=הסכמה'
  };
  CONTENT.items.forEach(i => { if (GLOSS[i.id]) i.gloss = GLOSS[i.id]; });

  /* ======================================================================
     כלי עזר
     ====================================================================== */
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function isoLocal(d) { return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d); }
  function parseISO(s) { return new Date(s + 'T12:00:00'); }
  function addDays(s, n) { const d = parseISO(s); d.setDate(d.getDate() + n); return isoLocal(d); }
  function gem(n) {
    const ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'], tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'], hund = ['', 'ק', 'ר', 'ש', 'ת'];
    let s = ''; let h = Math.floor(n / 100); while (h > 4) { s += 'ת'; h -= 4; } s += hund[h];
    const r = n % 100; if (r === 15) s += 'טו'; else if (r === 16) s += 'טז'; else s += tens[Math.floor(r / 10)] + ones[r % 10];
    return s.length === 1 ? s + '׳' : s.slice(0, -1) + '״' + s.slice(-1);
  }
  function hebDate(iso) {
    try {
      const parts = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(parseISO(iso));
      const g = t => (parts.find(p => p.type === t) || {}).value;
      return gem(+g('day')) + ' ב' + (HEB_MONTHS[g('month')] || g('month')) + ' ' + gem(+g('year') % 1000);
    } catch (e) { return ''; }
  }
  function gregDate(iso) { return new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(parseISO(iso)); }
  function heDate(iso) { try { return new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long' }).format(parseISO(iso)); } catch (e) { return iso; } }
  function weekday(iso) { try { return new Intl.DateTimeFormat('he-IL', { weekday: 'long' }).format(parseISO(iso)); } catch (e) { return iso; } }
  function paras(text) { const f = document.createDocumentFragment(); String(text || '').split(/\n+/).filter(Boolean).forEach(p => f.append(el('p', null, p))); return f; }
  function daysLabel(n) {
    if (n <= 1) return 'מחר';
    if (n === 2) return 'בעוד יומיים';
    if (n < 28) return 'בעוד ' + n + ' ימים';
    if (n >= 350) return 'בעוד שנה';
    if (n >= 40 && n <= 50) return 'בעוד חודש וחצי';
    const m = Math.round(n / 30);
    return m <= 1 ? 'בעוד חודש' : m === 2 ? 'בעוד חודשיים' : 'בעוד ' + m + ' חודשים';
  }
  const norm = s => String(s || '').toLowerCase().replace(/[֑-ׇ]/g, '');
  const hasLatin = s => /[A-Za-z]/.test(String(s || '')) && !/[א-ת]/.test(String(s || ''));
  let toastT;
  function toast(msg) {
    let t = $('.toast'); if (!t) { t = el('div', 'toast'); t.setAttribute('role', 'status'); document.body.append(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2800);
  }
  function chipFor(it) {
    const isEn = it.type === 'english';
    const key = DOMAINS[it.domain] ? it.domain : 'current';
    const c = el('span', 'chip', isEn ? 'אנגלית · ' + (DOMAINS[key] || '') : (DOMAINS[key] || ''));
    c.style.setProperty('--d', 'var(--c-' + key + ')');
    return c;
  }

  let today = isoLocal(new Date());

  /* ======================================================================
     אחסון מקומי
     ====================================================================== */
  function blank() { return { v: 1, days: {}, extras: {}, items: {}, quotes: {}, weekly: {}, answers: {}, requests: {}, settings: { theme: 'auto', auto: true, hour: 5, model: 'claude-sonnet-5-5' } }; }
  function fromData(o) {
    const b = blank();
    Object.keys(b).forEach(k => { if (o[k] && typeof o[k] === 'object') b[k] = k === 'settings' ? Object.assign(b.settings, o[k]) : o[k]; });
    return b;
  }
  /* ניקוי תגיות מקור שהמודל מוסיף לפעמים אחרי חיפוש ברשת */
  const CITE_RE = /<\/?\s*cite\b[^>]*>/gi;
  function stripCites(o) {
    if (typeof o === 'string') return o.indexOf('cite') < 0 ? o : o.replace(CITE_RE, '').replace(/[ \t]{2,}/g, ' ');
    if (Array.isArray(o)) return o.map(stripCites);
    if (o && typeof o === 'object') { const r = {}; for (const k in o) r[k] = stripCites(o[k]); return r; }
    return o;
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const o = JSON.parse(raw); if (o && o.v === 1) return fromData(stripCites(o)); }
    } catch (e) { /* אחסון חסום או פגום */ }
    return blank();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); return true; }
    catch (e) { toast('השמירה במכשיר נכשלה. בצע גיבוי נתונים כדי לא לאבד את ההתקדמות.'); return false; }
  }
  const validDate = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
  function itemDefaults(d) {
    const due = addDays(d.date, NEW_ITEM_DAYS);
    return { status: 'new', favorite: false, review: { level: 0, easyCount: 0, nextReview: due, history: [] }, due };
  }
  /* ממזג בלוק תוכן. onlyMissing=true מוסיף רק מה שחסר (לתוכן המובנה). התקדמות המשתמש בפריטים קיימים נשמרת תמיד. */
  function mergeContent(block, onlyMissing) {
    const c = { days: 0, items: 0, quotes: 0, weekly: 0, requests: 0, skipped: 0 };
    const arr = k => (block && Array.isArray(block[k])) ? block[k] : [];
    arr('days').forEach(d => {
      if (!d || !validDate(d.date)) { c.skipped++; return; }
      if (onlyMissing && S.days[d.date]) return;
      S.days[d.date] = { date: d.date, topic: String(d.topic || ''), intro: String(d.intro || '') }; c.days++;
    });
    arr('extras').forEach(d => {
      if (!d || !validDate(d.date)) { c.skipped++; return; }
      if (onlyMissing && S.extras[d.date]) return;
      S.extras[d.date] = Object.assign({}, d);
    });
    arr('items').forEach(d => {
      if (!d || !d.id || !validDate(d.date) || (d.type !== 'knowledge' && d.type !== 'english')) { c.skipped++; return; }
      const ex = S.items[d.id];
      if (ex && onlyMissing) {
        /* משלים שדות תוכן חדשים (כמו "העמקה") בלי לגעת בהתקדמות */
        Object.keys(d).forEach(k => { if (ex[k] === undefined && !['status', 'favorite', 'review', 'due'].includes(k)) ex[k] = d[k]; });
        return;
      }
      const keep = ex ? { status: ex.status, favorite: ex.favorite, review: ex.review, due: ex.due } : itemDefaults(d);
      const content = Object.assign({}, d); delete content.status; delete content.favorite; delete content.review; delete content.due;
      S.items[d.id] = Object.assign(content, keep); c.items++;
    });
    arr('quotes').forEach(d => {
      if (!d || !d.id || !d.text) { c.skipped++; return; }
      if (onlyMissing && S.quotes[d.id]) return;
      if (S.quotes[d.id] && S.quotes[d.id].mine) return;
      S.quotes[d.id] = Object.assign({ mine: false }, d); c.quotes++;
    });
    arr('weekly').forEach(d => {
      if (!d || !validDate(d.week)) { c.skipped++; return; }
      const ex = S.weekly[d.week];
      if (ex && onlyMissing) return;
      const w = Object.assign({}, d, { id: d.week });
      if (ex) { w.results = ex.results; w.attempts = ex.attempts; }
      S.weekly[d.week] = w; c.weekly++;
    });
    arr('requestsDone').forEach(id => { const r = S.requests[id]; if (r && r.status !== 'done') { r.status = 'done'; r.answeredDate = today; c.requests++; } });
    return c;
  }

  let S = load();
  mergeContent(CONTENT, true);
  save();

  const daysList = () => Object.values(S.days).sort((a, b) => a.date < b.date ? 1 : -1);
  /* האנגלית מושבתת כרגע לבקשת הלומד. הנתונים נשמרים; להחזרה: EN_ON = true */
  const EN_ON = false;
  const itemsList = () => EN_ON ? Object.values(S.items) : Object.values(S.items).filter(i => i.type !== 'english');
  function pickDate() { const ds = daysList(); if (!ds.length) return null; return (ds.find(x => x.date <= today) || ds[ds.length - 1]).date; }
  let currentDate = pickDate();
  const dayItems = () => itemsList().filter(i => i.date === currentDate);

  /* ======================================================================
     חזרה מרווחת — הלוגיקה המשותפת
     ====================================================================== */
  /* rv: אובייקט החזרה הנוכחי של הפריט */
  function planFor(rv, grade) {
    rv = rv || {};
    const lvl0 = rv.level || 0, easyN = rv.easyCount || 0;
    if (grade === 'easy') return { lvl: Math.min(lvl0 + 1, 5), easyCount: easyN + 1, days: EASY_DAYS[Math.min(easyN, EASY_DAYS.length - 1)] };
    if (grade === 'medium') { const lvl = Math.max(lvl0, 1); return { lvl, easyCount: easyN, days: MEDIUM_DAYS[Math.min(lvl - 1, MEDIUM_DAYS.length - 1)] }; }
    return { lvl: 0, easyCount: easyN, days: HARD_DAYS };
  }
  function cloneReview(src) {
    const rv = JSON.parse(JSON.stringify(src || { level: 0, easyCount: 0, history: [] }));
    rv.history = Array.isArray(rv.history) ? rv.history : [];
    return rv;
  }
  /* מדרג פריט. base: מצב החזרה שממנו מחשבים (ברירת מחדל: המצב הנוכחי) */
  function applyGrade(id, grade, base) {
    const it = S.items[id]; if (!it) return 0;
    const rv = cloneReview(base || it.review), p = planFor(rv, grade);
    rv.level = p.lvl; rv.easyCount = p.easyCount; rv.nextReview = addDays(today, p.days);
    rv.history.push({ date: today, rating: grade });
    Object.assign(it, { status: STATUS_OF[grade], review: rv, due: rv.nextReview });
    return p.days;
  }
  function gradeItem(it, grade) { applyGrade(it.id, grade); delete S.items[it.id].todayRating; save(); }
  const isLearned = it => it.status === 'understood' || it.status === 'easy';

  /* ======================================================================
     מסך "היום"
     ====================================================================== */
  function setDates(iso) { const d = $('#dates'); d.innerHTML = ''; d.append(el('b', null, hebDate(iso)), document.createTextNode(' · ' + gregDate(iso))); }

  function renderTopic() {
    const t = $('#topic'); t.innerHTML = '';
    const d = currentDate && S.days[currentDate];
    $('#hero').hidden = !d;
    if (!d) { $('#daynum').hidden = true; setDates(today); return; }
    const asc0 = daysList().reverse(), pos = asc0.findIndex(x => x.date === currentDate);
    const nav = el('div', 'daynav');
    const mkNav = (cls, label, aria, target, dis) => { const b = el('button', 'dn-btn ' + cls, label); b.type = 'button'; b.setAttribute('aria-label', aria); b.disabled = !!dis; b.addEventListener('click', () => goDay(target)); return b; };
    const prev = asc0[pos - 1], next = asc0[pos + 1];
    nav.append(mkNav('prev', '›', 'היום הקודם', prev && prev.date, !prev));
    const lbl = el('span', 'dn-label', currentDate === today ? 'התדריך של היום' : (currentDate > today ? 'תדריך נוסף · ' : '') + weekday(currentDate) + ', ' + heDate(currentDate));
    nav.append(lbl, mkNav('next', '‹', 'היום הבא', next && next.date, !next));
    const add = el('button', 'dn-add', genBusy ? 'נכתב תדריך…' : '+ תדריך נוסף'); add.type = 'button'; add.disabled = genBusy;
    add.addEventListener('click', generateExtra);
    nav.append(add);
    t.append(nav);
    t.append(el('div', 'eyebrow', currentDate > today ? 'נושא התדריך' : 'הנושא של היום'), el('h1', null, d.topic || ''));
    if (d.intro) t.append(el('p', 'intro', d.intro));
    const k = dayItems().filter(i => i.type === 'knowledge');
    const done = k.filter(isLearned).length;
    const pr = el('div', 'progress'); const bar = el('div', 'bar'); const fill = el('i'); bar.append(fill);
    pr.append(el('span', null, done + ' מתוך ' + k.length + ' הובנו'), bar); t.append(pr);
    requestAnimationFrame(() => { fill.style.width = (k.length ? done / k.length * 100 : 0) + '%'; });
    const asc = daysList().reverse();
    const dn = $('#daynum'); dn.textContent = 'יום ' + (asc.findIndex(x => x.date === currentDate) + 1); dn.hidden = false;
    setDates(currentDate);
  }

  function goDay(dt) {
    if (!dt || !S.days[dt]) return;
    currentDate = dt; practice = null; answerDraft = { date: null, text: '', dirty: false };
    renderAll(); window.scrollTo(0, 0);
  }

  function renderCards() {
    const c = $('#cards'); c.innerHTML = '';
    if (!currentDate) {
      const s = el('div', 'state'); s.append(el('h2', null, 'אין עדיין תדריך'), el('p', null, 'ייבא תדריך יומי דרך ההגדרות, והוא יופיע כאן.'));
      c.append(s); return;
    }
    const k = dayItems().filter(i => i.type === 'knowledge').sort((a, b) => (a.order || 0) - (b.order || 0));
    if (!k.length) { const s = el('div', 'state'); s.append(el('h2', null, 'אין נקודות ידע ליום הזה')); c.append(s); return; }
    c.append(el('p', 'hintline', 'קל: חוזר בעוד 5 חודשים · הבנתי: בעוד חודש וחצי · קשה לי: בעוד חודש'));
    k.forEach((it, i) => {
      const card = el('article', 'card' + (isLearned(it) ? ' done' : '')); card.style.setProperty('--d', 'var(--c-' + (DOMAINS[it.domain] ? it.domain : 'current') + ')');
      const head = el('div', 'card-head'); head.append(chipFor(it), el('span', 'idx', (i + 1) + ' / ' + k.length));
      card.append(head, el('h2', null, it.title || ''));
      const body = el('div', 'body'); body.append(paras(it.content)); card.append(body);
      if (it.why) { const f = el('div', 'facet'); f.append(el('span', 'lbl', 'למה זה חשוב'), paras(it.why)); card.append(f); }
      if (it.how) { const f = el('div', 'facet'); f.append(el('span', 'lbl', 'איך משתמשים בזה'), paras(it.how)); card.append(f); }
      card.append(rateBar(it), deepenPanel(it));
      c.append(card);
    });
  }

  /* סרגל דירוג למסך היום: קל / הבנתי / קשה לי / מועדפים */
  function todayRatingOf(it) { return it.todayRating && it.todayRating.date === today ? it.todayRating : null; }
  function rateBar(it) {
    const a = el('div', 'actions');
    const rt = todayRatingOf(it);
    const pressedFor = g => rt ? rt.grade === g : it.status === STATUS_OF[g];
    const mk = (cls, label, pressed, act, title) => { const b = el('button', 'btn ' + cls, label); b.type = 'button'; if (title) b.title = title; b.setAttribute('aria-pressed', pressed ? 'true' : 'false'); b.addEventListener('click', () => act(it)); return b; };
    a.append(
      mk('easy', 'קל', pressedFor('easy'), x => rateToday(x, 'easy'), 'חוזר לחזרה בעוד 5 חודשים'),
      mk('ok', '✓ הבנתי', pressedFor('medium'), x => rateToday(x, 'medium'), 'חוזר לחזרה בעוד חודש וחצי'),
      mk('hard', 'קשה לי', pressedFor('hard'), x => rateToday(x, 'hard'), 'חוזר לחזרה בעוד חודש'),
      mk('fav', it.favorite ? '★ במועדפים' : '☆ למועדפים', !!it.favorite, toggleFav)
    );
    return a;
  }
  /* לחיצה חוזרת על אותו דירוג באותו יום מבטלת אותו; לחיצה על דירוג אחר מחליפה אותו */
  function rateToday(it, grade) {
    const item = S.items[it.id]; const rt = todayRatingOf(item);
    if (rt && rt.grade === grade) {
      Object.assign(item, { status: rt.status || 'new', review: rt.base, due: rt.due });
      delete item.todayRating; save(); renderAll(); toast('הדירוג בוטל'); return;
    }
    const base = rt ? rt.base : cloneReview(item.review);
    const snap = { date: today, grade, base, status: rt ? rt.status : item.status, due: rt ? rt.due : item.due };
    const days = applyGrade(item.id, grade, base);
    item.todayRating = snap; save(); renderAll();
    toast('נשמר. יחזור לחזרה ' + daysLabel(days));
  }

  /* "העמק בנושא": כיווני העמקה, מקורות, ושאלה משלך */
  const openDeepen = new Set(), deepDraft = {};
  function claudeUrl(it, q) {
    const ctx = String(it.content || '').replace(/\s+/g, ' ').slice(0, 900);
    const ask = q || 'הרחב את הנושא לעומק: הרקע, המחלוקות המרכזיות, ומה ראוי שאדם חכם יידע עליו.';
    const prompt = 'אני לומד בעזרת "דעת יומית". הנושא: ' + (it.title || '') + ' (' + (DOMAINS[it.domain] || '') + ').\nתקציר: ' + ctx + '\n\nהשאלה שלי: ' + ask + '\n\nענה בעברית, לעומק ובנימה מכובדת, בלי הקדמות.';
    return { url: 'https://claude.ai/new?q=' + encodeURIComponent(prompt), prompt };
  }
  function deepenPanel(it) {
    const d = el('details', 'deepen'); if (openDeepen.has(it.id)) d.open = true;
    d.addEventListener('toggle', () => { if (d.open) openDeepen.add(it.id); else openDeepen.delete(it.id); });
    d.append(el('summary', null, 'העמק בנושא'));
    const inn = el('div', 'deepen-in');
    const dp = it.deepen || {};
    if (Array.isArray(dp.directions) && dp.directions.length) {
      inn.append(el('span', 'lbl', 'כיווני העמקה'));
      const ul = el('ul', 'dlist'); dp.directions.forEach(x => ul.append(el('li', null, x))); inn.append(ul);
    }
    if (Array.isArray(dp.sources) && dp.sources.length) {
      inn.append(el('span', 'lbl', 'מקורות להמשך'));
      const ul = el('ul', 'dlist'); dp.sources.forEach(x => { const li = el('li', null, x); if (hasLatin(x)) { li.lang = 'en'; li.dir = 'ltr'; li.style.textAlign = 'right'; } ul.append(li); }); inn.append(ul);
    }
    const qa = Array.isArray(S.items[it.id] && S.items[it.id].qa) ? S.items[it.id].qa : [];
    if (qa.length) {
      inn.append(el('span', 'lbl', 'שאלות ותשובות'));
      const box = el('div', 'qa');
      qa.forEach(x => { const q = el('div', 'qa-item'); const a = el('div', 'a'); a.append(paras(x.a)); q.append(el('p', 'q', x.q), a, el('span', 'rv-from', heDate(x.date))); box.append(q); });
      inn.append(box);
    }
    inn.append(el('span', 'lbl', 'שאלה משלך'));
    const ta = el('textarea', 'field'); ta.rows = 3; ta.maxLength = 600; ta.id = 'deep-' + it.id;
    ta.placeholder = 'מה עוד תרצה לדעת על הנושא?'; ta.setAttribute('aria-label', 'שאלה משלך על ' + (it.title || 'הנושא')); ta.value = deepDraft[it.id] || '';
    const row = el('div', 'ans-row');
    let ask;
    if (getKey()) {
      const busyNow = askBusy.has(it.id);
      ask = el('button', 'primary', busyNow ? 'מכין תשובה…' : 'שאל'); ask.type = 'button'; ask.disabled = busyNow;
      ask.addEventListener('click', () => askAbout(it, ta.value.trim()));
      ta.addEventListener('input', () => { deepDraft[it.id] = ta.value; });
    } else {
      ask = el('a', 'primary linkbtn', 'שאל את Claude באתר'); ask.target = '_blank'; ask.rel = 'noopener';
      const setHref = () => { ask.href = claudeUrl(it, ta.value.trim()).url; };
      setHref();
      ta.addEventListener('input', () => { deepDraft[it.id] = ta.value; setHref(); });
    }
    const keep = el('button', 'ghost', 'שמור לתדריך הבא'); keep.type = 'button';
    keep.addEventListener('click', () => {
      const text = ta.value.trim(); if (!text) { toast('כתוב קודם את השאלה.'); ta.focus(); return; }
      const id = 'r' + Date.now().toString(36);
      S.requests[id] = { id, text, createdAt: new Date().toISOString(), status: 'pending', itemId: it.id, itemTitle: it.title || '' };
      if (save()) { deepDraft[it.id] = ''; renderAll(); toast('נשמר. השאלה תיכנס לתדריך הבא.'); }
    });
    const cp = el('button', 'pbtn', 'העתק שאלה'); cp.type = 'button';
    cp.addEventListener('click', () => copyText(claudeUrl(it, ta.value.trim()).prompt));
    row.append(ask, keep); if (!getKey()) row.append(cp);
    inn.append(ta, row);
    if (getKey()) inn.append(el('span', 'nextrev', 'התשובה מתקבלת כאן ונשמרת בכרטיס. כשאין צורך בתשובה מיידית, "שמור לתדריך הבא" יכניס את השאלה לתדריך של מחר.'));
    const mine = requestsList().filter(r => r.itemId === it.id);
    if (mine.length) {
      const ul = el('ul', 'asklist');
      mine.forEach(r => { const li = el('li'); li.append(el('span', null, r.text), el('span', 'pill ' + (r.status === 'done' ? 'done' : 'pending'), r.status === 'done' ? 'נענה' : 'ממתין')); ul.append(li); });
      inn.append(ul);
    }
    d.append(inn); return d;
  }
  function toggleFav(it) { S.items[it.id].favorite = !it.favorite; save(); renderAll(); }

  /* תשובה לשאלה למחשבה */
  let answerDraft = { date: null, text: '', dirty: false };
  function answerBox(container, question) {
    const saved = S.answers[currentDate];
    if (answerDraft.date !== currentDate) answerDraft = { date: currentDate, text: (saved && saved.text) || '', dirty: false };
    const wrap = el('div', 'ans');
    const ta = el('textarea', 'field'); ta.id = 'answer-input'; ta.rows = 4; ta.maxLength = 3000; ta.placeholder = 'העמדה שלי, בכמה משפטים...'; ta.setAttribute('aria-label', 'התשובה שלי'); ta.value = answerDraft.text;
    const row = el('div', 'ans-row');
    const btn = el('button', 'primary', saved ? 'עדכן תשובה' : 'שמור תשובה'); btn.type = 'button';
    const st = el('span', 'nextrev', saved && !answerDraft.dirty ? 'נשמרה ביומן ההשקפה' : '');
    ta.addEventListener('input', () => { answerDraft.text = ta.value; answerDraft.dirty = true; st.textContent = ''; });
    btn.addEventListener('click', () => {
      const text = ta.value.trim(); if (!text) { toast('כתוב קודם תשובה קצרה.'); ta.focus(); return; }
      S.answers[currentDate] = { date: currentDate, question, text, updatedAt: new Date().toISOString() };
      if (save()) { answerDraft = { date: currentDate, text, dirty: false }; st.textContent = 'נשמרה ביומן ההשקפה'; btn.textContent = 'עדכן תשובה'; toast('התשובה נשמרה'); }
    });
    row.append(btn, st); wrap.append(ta, row); container.append(wrap);
  }

  function renderExtras() {
    const x = $('#extras'); x.innerHTML = '';
    const ex = currentDate && S.extras[currentDate];
    if (!ex) { x.hidden = true; return; }
    x.hidden = false;
    x.append(el('h3', 'section', 'להעמקה'));
    if (ex.model) { const b = el('div', 'extra'); b.append(el('span', 'lbl', 'מודל חשיבה'), el('h3', null, ex.model.title || ''), paras(ex.model.body)); x.append(b); }
    if (ex.question) { const b = el('div', 'extra question'); b.append(el('span', 'lbl', 'שאלה למחשבה'), el('p', 'q', ex.question)); answerBox(b, ex.question); x.append(b); }
    if (ex.challenge) { const b = el('div', 'extra'); b.append(el('span', 'lbl', 'אתגר דיבור · דקה אחת'), paras(ex.challenge)); x.append(b); }
  }

  /* בקשות "תלמד אותי על..." */
  const requestsList = () => Object.values(S.requests).sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
  function renderAsk() {
    const ul = $('#ask-list'); ul.innerHTML = '';
    requestsList().slice(0, 8).forEach(r => {
      const li = el('li'); li.append(el('span', null, (r.itemTitle ? 'על "' + r.itemTitle + '": ' : '') + (r.text || '')));
      li.append(el('span', 'pill ' + (r.status === 'done' ? 'done' : 'pending'), r.status === 'done' ? ('נענה' + (r.answeredDate ? ' · ' + heDate(r.answeredDate) : '')) : 'ממתין לתדריך הבא'));
      ul.append(li);
    });
  }
  $('#ask-form').addEventListener('submit', e => {
    e.preventDefault();
    const inp = $('#ask-input'); const text = inp.value.trim(); if (!text) { inp.focus(); return; }
    const id = 'r' + Date.now().toString(36);
    S.requests[id] = { id, text, createdAt: new Date().toISOString(), status: 'pending' };
    if (save()) { inp.value = ''; renderAsk(); renderProgress(); renderSettings(); toast('נשמר. הבקשה תיכנס לתדריך הבא.'); }
  });

  /* ======================================================================
     אנגלית
     ====================================================================== */
  let enMode = 'list', hideHe = false, practice = null;
  /* ---------- קול ההקראה: בחירה אוטומטית של קול נשי איכותי, או בחירה ידנית בהגדרות ---------- */
  const tts = ('speechSynthesis' in window) ? window.speechSynthesis : null;
  const FEMALE_RX = /female|samantha|\bava\b|allison|susan|\bzoe\b|karen|moira|tessa|fiona|victoria|serena|\bkate\b|nicky|joanna|salli|kimberly|kendra|\bivy\b|\bemma\b|\bamy\b|olivia|\baria\b|jenny|zira|libby|sonia|michelle|natasha|clara|catherine|google us english|-sfg|-tpf|-tpc|-iob|-iog/i;
  const MALE_RX = /\bmale\b|daniel|\balex\b|\bfred\b|\btom\b|rishi|oliver|arthur|aaron|\bguy\b|ryan|david|\bmark\b|george|\bevan\b|nathan|reed|rocko|grandpa|eddy|ralph|-iom|-iol|-tpd/i;
  const NOVELTY_RX = /novelty|bells|bubbles|whisper|zarvox|trinoids|jester|organ|superstar|cellos|boing|bahh|albert|hysterical|deranged|wobble|good news|bad news|junior|shelley|sandy|flo\b|grandma/i;
  const isFemale = v => FEMALE_RX.test(v.name + ' ' + v.voiceURI);
  function voiceScore(v) {
    let s = 0; const id = v.name + ' ' + v.voiceURI;
    if (isFemale(v)) s += 10; else if (MALE_RX.test(id)) s -= 10;
    if (/premium|enhanced|natural|neural|online|siri/i.test(v.name)) s += 4;
    if (/google/i.test(v.name)) s += 3;
    if (/^en[-_]US/i.test(v.lang)) s += 2; else if (/^en[-_]GB/i.test(v.lang)) s += 1.5;
    if (NOVELTY_RX.test(v.name)) s -= 30;
    return s;
  }
  let voices = [], enVoice = null, voiceCount = -1;
  function loadVoices() {
    if (!tts) return;
    try { voices = (tts.getVoices() || []).filter(v => /^en/i.test(v.lang)).sort((a, b) => voiceScore(b) - voiceScore(a)); } catch (e) { voices = []; }
    const chosen = S.settings.voice;
    enVoice = (chosen && voices.find(v => v.voiceURI === chosen)) || voices[0] || null;
    renderVoiceSettings();
  }
  if (tts) { loadVoices(); try { tts.addEventListener('voiceschanged', loadVoices); } catch (e) { /* דפדפן ישן */ } setTimeout(loadVoices, 600); }
  function speak(text, slow) {
    if (!tts) { toast('ההשמעה אינה זמינה בדפדפן הזה.'); return; }
    if (!voices.length) loadVoices();
    try {
      tts.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = enVoice ? enVoice.lang : 'en-US'; if (enVoice) u.voice = enVoice;
      const base = +S.settings.rate || 0.95; u.rate = slow ? Math.max(0.5, base * 0.75) : base; u.pitch = 1;
      tts.speak(u);
    } catch (e) { toast('ההשמעה אינה זמינה בדפדפן הזה.'); }
  }
  function renderVoiceSettings() {
    const sel = $('#voice-select'); if (!sel) return;
    if (!tts) { sel.disabled = true; $('#voice-info').textContent = 'ההקראה אינה זמינה בדפדפן הזה.'; return; }
    if (voiceCount !== voices.length) {
      voiceCount = voices.length; sel.innerHTML = '';
      const auto = el('option', null, 'Auto · ' + (voices[0] ? voices[0].name : '—')); auto.value = ''; sel.append(auto);
      voices.forEach(v => { const o = el('option', null, v.name + ' · ' + v.lang + (isFemale(v) ? ' · female' : '')); o.value = v.voiceURI; sel.append(o); });
    }
    sel.value = S.settings.voice && voices.some(v => v.voiceURI === S.settings.voice) ? S.settings.voice : '';
    $('#rate-select').value = String(S.settings.rate || 0.95);
    $('#voice-info').textContent = !voices.length ? 'לא נמצאו קולות באנגלית במכשיר.' : enVoice ? 'נבחר: ' + enVoice.name + (isFemale(enVoice) ? ' (קול נשי)' : '') : '';
  }
  $('#voice-select').addEventListener('change', e => { S.settings.voice = e.target.value; save(); loadVoices(); speak('Legitimacy must be earned through consultation and consent.'); });
  $('#rate-select').addEventListener('change', e => { S.settings.rate = +e.target.value; save(); });
  $('#btn-voice-test').addEventListener('click', () => speak('A leader who cannot articulate a coherent vision will struggle to command loyalty.'));

  /* ---------- פירוש מילה במילה ---------- */
  function parseGloss(g) {
    if (Array.isArray(g)) return g.filter(p => Array.isArray(p) && p[0]).map(p => [String(p[0]), String(p[1] || '')]);
    if (typeof g === 'string') return g.split('|').map(s => { const i = s.indexOf('='); return i < 0 ? [s.trim(), ''] : [s.slice(0, i).trim(), s.slice(i + 1).trim()]; }).filter(p => p[0]);
    return [];
  }
  const openGloss = new Set(), glossBusy = new Set();
  function glossBox(it) {
    const id = it.id, w = el('div', 'gloss'), open = openGloss.has(id);
    const b = el('button', 'gloss-toggle', open ? 'הסתר פירוש מילה במילה' : 'פירוש מילה במילה'); b.type = 'button'; b.setAttribute('aria-expanded', open);
    b.addEventListener('click', () => {
      if (openGloss.has(id)) openGloss.delete(id);
      else { openGloss.add(id); const cur = S.items[id]; if (cur && !parseGloss(cur.gloss).length && getKey()) { makeGloss(cur); return; } }
      renderAll();
    });
    w.append(b);
    if (!open) return w;
    const pairs = parseGloss(S.items[id] && S.items[id].gloss);
    if (pairs.length) {
      const kws = String(it.keyword || '').toLowerCase().split('·').map(s => s.trim()).filter(Boolean);
      const STOP = ['a', 'an', 'the', 'to', 'of', 'and', 'or', 'in', 'on', 'for', 'with', 'is'];
      const isKw = word => { const x = word.toLowerCase().replace(/[^a-z'’ -]/g, ''); if (STOP.includes(x)) return false; return kws.some(k => k === x || k.split(/\s+/).includes(x)); };
      const g = el('div', 'gl'); g.lang = 'en'; g.setAttribute('aria-label', 'פירוש מילה במילה');
      pairs.forEach(([en, he]) => { const t = el('span', 'w' + (isKw(en) ? ' kw' : '')); const sm = el('small', null, he); sm.lang = 'he'; t.append(el('b', null, en), sm); g.append(t); });
      w.append(g);
    } else if (glossBusy.has(id)) w.append(el('p', 'gloss-note', 'מכין פירוש מילולי…'));
    else if (getKey()) { const r = el('button', 'pbtn', 'צור פירוש מילולי'); r.type = 'button'; r.addEventListener('click', () => makeGloss(S.items[id])); w.append(r); }
    else w.append(el('p', 'gloss-note', 'לפריט הזה אין עדיין פירוש מילולי. עם מפתח API בהגדרות, הפירוש נוצר אוטומטית.'));
    return w;
  }
  const enItems = () => dayItems().filter(i => i.type === 'english').sort((a, b) => (a.order || 0) - (b.order || 0));
  function highlight(text, kw) {
    text = String(text || ''); const f = document.createDocumentFragment();
    const lower = text.toLowerCase(), ranges = [];
    String(kw || '').split('·').map(s => s.trim()).filter(Boolean).forEach(p => { const i = lower.indexOf(p.toLowerCase()); if (i >= 0) ranges.push([i, i + p.length]); });
    ranges.sort((a, b) => a[0] - b[0]); let pos = 0;
    ranges.forEach(([s, e]) => { if (s < pos) return; f.append(document.createTextNode(text.slice(pos, s)), el('mark', 'kw', text.slice(s, e))); pos = e; });
    f.append(document.createTextNode(text.slice(pos))); return f;
  }
  function playBtns(text, small) {
    const w = el('div', 'play');
    const a = el('button', 'pbtn', small ? '▶' : '▶ השמע'); a.type = 'button'; a.setAttribute('aria-label', 'השמע באנגלית'); a.addEventListener('click', () => speak(text, false)); w.append(a);
    if (!small) { const b = el('button', 'pbtn', '▶ לאט'); b.type = 'button'; b.setAttribute('aria-label', 'השמע לאט'); b.addEventListener('click', () => speak(text, true)); w.append(b); }
    return w;
  }
  function kwBox(it) { const k = el('div', 'kwbox'); k.append(el('span', 'k', it.keyword), el('span', null, it.keywordHe || '')); return k; }

  function renderEnglish() {
    if ($('#view-english').hidden) return;
    const list = enItems();
    $('#en-count').textContent = list.length ? list.length + ' משפטים להיום' : '';
    $('#mode-list').setAttribute('aria-pressed', enMode === 'list');
    $('#mode-practice').setAttribute('aria-pressed', enMode === 'practice');
    const box = $('#en-body'); box.innerHTML = '';
    if (!list.length) { const s = el('div', 'state'); s.append(el('h2', null, 'אין משפטים ליום הזה'), el('p', null, 'המשפטים מגיעים יחד עם התדריך היומי.')); box.append(s); return; }
    if (enMode === 'list') renderEnList(box, list); else renderPractice(box, list);
  }

  function renderEnList(box, list) {
    const tb = el('div', 'toolbar');
    tb.append(el('span', null, 'הקש ▶ כדי לשמוע את ההגייה. קל: חוזר בעוד 5 חודשים.'));
    const t = el('button', 'btn', hideHe ? 'הצג תרגומים' : 'הסתר תרגומים'); t.type = 'button'; t.setAttribute('aria-pressed', hideHe);
    t.addEventListener('click', () => { hideHe = !hideHe; renderEnglish(); }); tb.append(t); box.append(tb);
    const wrap = el('section', 'list'); wrap.setAttribute('aria-label', 'משפטי האנגלית');
    list.forEach((it, i) => {
      const card = el('article', 'card'); card.style.setProperty('--d', 'var(--c-' + (DOMAINS[it.domain] ? it.domain : 'current') + ')');
      const head = el('div', 'card-head'); head.append(chipFor(it), el('span', 'idx', (i + 1) + ' / ' + list.length)); card.append(head);
      const en = el('p', 'en'); en.lang = 'en'; en.append(highlight(it.en, it.keyword)); card.append(en);
      if (!hideHe) card.append(el('p', 'he', it.he || ''));
      card.append(glossBox(it));
      card.append(playBtns(it.en));
      if (it.keyword) card.append(kwBox(it));
      if (it.example) {
        const ex = el('div', 'example'); ex.append(el('span', 'lbl', 'דוגמה נוספת'));
        const row = el('div', 'example-row'); const p = el('p', 'en-sm', it.example); p.lang = 'en'; row.append(p, playBtns(it.example, true)); ex.append(row);
        if (!hideHe && it.exampleHe) ex.append(el('p', 'he', it.exampleHe));
        card.append(ex);
      }
      card.append(rateBar(it));
      wrap.append(card);
    });
    box.append(wrap);
  }

  function startPractice(ids, dir) { practice = { order: ids, i: 0, flipped: false, hint: false, dir: dir || (practice && practice.dir) || 'he2en', res: { easy: 0, medium: 0, hard: 0 }, hardIds: [] }; }
  function summaryBox(res, extraLine) {
    const s = el('div', 'summary');
    const t = el('div', 'tally');
    [['easy', 'קל'], ['medium', 'בינוני'], ['hard', 'קשה']].forEach(([k, l]) => { const d = el('div'); d.append(el('b', null, String(res[k])), el('span', null, l)); t.append(d); });
    s.append(t); if (extraLine) s.append(el('p', 'he', extraLine));
    return s;
  }
  function gradeButtons(it, onGrade) {
    const g = el('div', 'grades');
    [['easy', 'קל'], ['medium', 'בינוני'], ['hard', 'קשה']].forEach(([k, l]) => {
      const b = el('button', 'grade ' + k); b.type = 'button';
      b.append(el('span', null, l), el('small', null, daysLabel(planFor(it.review, k).days)));
      b.addEventListener('click', () => onGrade(k)); g.append(b);
    });
    return g;
  }

  function renderPractice(box, list) {
    if (!practice) startPractice(list.map(x => x.id));
    const w = el('div', 'flash-wrap'); box.append(w);
    if (practice.i >= practice.order.length) {
      const s = summaryBox(practice.res, 'כל משפט יחזור אליך בתור החזרה במועד שנקבע לפי הדירוג.');
      s.prepend(el('h2', null, 'סיימת את התרגול'));
      const r = el('div', 'row');
      const again = el('button', 'primary', 'תרגל שוב'); again.type = 'button'; again.addEventListener('click', () => { startPractice(list.map(x => x.id)); renderEnglish(); }); r.append(again);
      if (practice.hardIds.length) { const ids = practice.hardIds.slice(); const h = el('button', 'ghost', 'רק את הקשים (' + ids.length + ')'); h.type = 'button'; h.addEventListener('click', () => { startPractice(ids); renderEnglish(); }); r.append(h); }
      s.append(r); w.append(s); return;
    }
    const it = S.items[practice.order[practice.i]];
    if (!it) { practice.i++; renderEnglish(); return; }
    const meta = el('div', 'flash-meta');
    const bar = el('div', 'bar'); const fill = el('i'); fill.style.width = (practice.i / practice.order.length * 100) + '%'; bar.append(fill);
    const dirBtn = el('button', 'btn', practice.dir === 'he2en' ? 'עברית ← אנגלית' : 'אנגלית ← עברית'); dirBtn.type = 'button'; dirBtn.setAttribute('aria-label', 'החלף כיוון תרגול');
    dirBtn.addEventListener('click', () => { practice.dir = practice.dir === 'he2en' ? 'en2he' : 'he2en'; practice.flipped = false; practice.hint = false; renderEnglish(); });
    meta.append(el('span', null, (practice.i + 1) + ' / ' + practice.order.length), bar, dirBtn); w.append(meta);

    const he2en = practice.dir === 'he2en';
    const card = el('div', 'flash'); card.style.setProperty('--d', 'var(--c-' + (DOMAINS[it.domain] ? it.domain : 'current') + ')');
    card.append(el('span', 'prompt', he2en ? 'כיצד אומרים זאת באנגלית?' : 'מה פירוש המשפט?'));
    const q = el('p', 'q' + (he2en ? '' : ' ltr'));
    if (he2en) q.textContent = it.he || ''; else { q.lang = 'en'; q.append(highlight(it.en, it.keyword)); }
    card.append(q);
    if (!he2en) card.append(playBtns(it.en));
    if (!practice.flipped) {
      if (he2en) {
        if (practice.hint) { const h = el('p', 'hint'); h.append(document.createTextNode('מילת המפתח: '), el('span', 'k', it.keyword || '')); card.append(h); }
        else { const hb = el('button', 'pbtn', 'הצג רמז'); hb.type = 'button'; hb.addEventListener('click', () => { practice.hint = true; renderEnglish(); }); const r = el('div', 'row'); r.append(hb); card.append(r); }
      }
      w.append(card);
      const flip = el('button', 'primary', 'הפוך כרטיס'); flip.type = 'button';
      flip.addEventListener('click', () => { practice.flipped = true; renderEnglish(); if (he2en) speak(it.en, false); });
      w.append(flip); return;
    }
    const a = el('div', 'a');
    if (he2en) { const en = el('p', 'en'); en.lang = 'en'; en.append(highlight(it.en, it.keyword)); a.append(en, playBtns(it.en)); }
    else a.append(el('p', 'he', it.he || ''));
    a.append(glossBox(it));
    if (it.keyword) a.append(kwBox(it));
    card.append(a); w.append(card);
    w.append(el('p', 'nextrev', 'כמה קל היה לך? הדירוג קובע מתי המשפט יחזור.'));
    w.append(gradeButtons(it, k => {
      gradeItem(it, k); practice.res[k]++; if (k === 'hard') practice.hardIds.push(it.id);
      practice.i++; practice.flipped = false; practice.hint = false; renderAll();
    }));
  }
  $('#mode-list').addEventListener('click', () => { enMode = 'list'; renderEnglish(); });
  $('#mode-practice').addEventListener('click', () => { if (enMode !== 'practice') { enMode = 'practice'; practice = null; } renderEnglish(); });

  /* ======================================================================
     חזרה
     ====================================================================== */
  let rsess = null;
  function dueNow() {
    return itemsList().filter(x => x.due && x.due <= today && x.date < today)
      .sort((a, b) => a.due !== b.due ? (a.due < b.due ? -1 : 1) : (a.date !== b.date ? (a.date < b.date ? -1 : 1) : ((a.order || 0) - (b.order || 0))));
  }
  function updateBadge() { const n = dueNow().length; const b = $('#rv-badge'); b.textContent = n > 99 ? '99+' : String(n); b.hidden = !n; }
  function startReview() { rsess = { order: dueNow().slice(0, SESSION_MAX).map(x => x.id), i: 0, flipped: false, res: { easy: 0, medium: 0, hard: 0 } }; }

  function renderReview() {
    if ($('#view-review').hidden) return;
    const box = $('#rv-body'); box.innerHTML = '';
    const now = dueNow();
    $('#rv-count').textContent = now.length ? now.length + ' פריטים ממתינים לחזרה' : '';
    if (!rsess && now.length) startReview();
    if (!rsess) { renderReviewEmpty(box); return; }
    const w = el('div', 'flash-wrap'); box.append(w);
    if (rsess.i >= rsess.order.length) {
      const s = summaryBox(rsess.res, now.length ? 'נותרו עוד ' + now.length + ' פריטים בתור.' : '');
      s.prepend(el('h2', null, 'סיימת את החזרה'));
      const r = el('div', 'row');
      if (now.length) { const more = el('button', 'primary', 'המשך לסבב הבא'); more.type = 'button'; more.addEventListener('click', () => { startReview(); renderReview(); }); r.append(more); }
      const done = el('button', now.length ? 'ghost' : 'primary', 'סיום'); done.type = 'button'; done.addEventListener('click', () => { rsess = null; renderReview(); }); r.append(done);
      s.append(r); w.append(s); return;
    }
    const it = S.items[rsess.order[rsess.i]];
    if (!it) { rsess.i++; renderReview(); return; }
    const meta = el('div', 'flash-meta');
    const bar = el('div', 'bar'); const fill = el('i'); fill.style.width = (rsess.i / rsess.order.length * 100) + '%'; bar.append(fill);
    meta.append(el('span', null, (rsess.i + 1) + ' / ' + rsess.order.length), bar); w.append(meta);

    const isEn = it.type === 'english';
    const card = el('div', 'flash'); card.style.setProperty('--d', 'var(--c-' + (DOMAINS[it.domain] ? it.domain : 'current') + ')');
    const tags = el('div', 'rv-tags'); tags.append(chipFor(it), el('span', 'rv-from', 'מתאריך ' + heDate(it.date))); card.append(tags);
    card.append(el('span', 'prompt', isEn ? 'כיצד אומרים זאת באנגלית?' : 'מה אתה זוכר?'));
    card.append(el('p', 'q', isEn ? (it.he || '') : (it.question || it.title || '')));
    if (!rsess.flipped) {
      w.append(card);
      const flip = el('button', 'primary', 'הפוך כרטיס'); flip.type = 'button';
      flip.addEventListener('click', () => { rsess.flipped = true; renderReview(); if (isEn) speak(it.en, false); });
      w.append(flip); return;
    }
    const a = el('div', 'a' + (isEn ? '' : ' knowledge'));
    if (isEn) { const en = el('p', 'en'); en.lang = 'en'; en.append(highlight(it.en, it.keyword)); a.append(en, playBtns(it.en), glossBox(it)); if (it.keyword) a.append(kwBox(it)); }
    else {
      if (it.question) a.append(el('h3', null, it.title || ''));
      const b = el('div', 'body'); b.append(paras(it.content)); a.append(b);
      if (it.how) { const f = el('div', 'facet'); f.append(el('span', 'lbl', 'איך משתמשים בזה'), paras(it.how)); a.append(f); }
    }
    card.append(a); w.append(card);
    w.append(el('p', 'nextrev', 'כמה טוב זכרת? הדירוג קובע מתי הפריט יחזור.'));
    w.append(gradeButtons(it, k => { gradeItem(it, k); rsess.res[k]++; rsess.i++; rsess.flipped = false; renderAll(); }));
  }

  function renderReviewEmpty(box) {
    const s = el('div', 'summary');
    s.append(el('h2', null, 'אין חזרות להיום'), el('p', 'he', 'כל פריט חוזר לכאן במועדו: "קל" בעוד 5 חודשים, "בינוני" בעוד חודש וחצי, "קשה" בעוד חודש. פריט שלא דורג נכנס לתור בעוד חודש.'));
    const up = {}; itemsList().forEach(x => { if (x.due && x.due > today) up[x.due] = (up[x.due] || 0) + 1; });
    const keys = Object.keys(up).sort().slice(0, 7);
    if (keys.length) {
      s.append(el('span', 'eyebrow', 'מה ממתין בהמשך'));
      const ul = el('ul', 'upcoming');
      const longDate = k => { try { return new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: k.slice(0, 4) !== today.slice(0, 4) ? 'numeric' : undefined }).format(parseISO(k)); } catch (e) { return k; } };
      keys.forEach(k => { const li = el('li'); li.append(el('span', null, k === addDays(today, 1) ? 'מחר' : longDate(k)), el('span', null, up[k] === 1 ? 'פריט אחד' : up[k] + ' פריטים')); ul.append(li); });
      s.append(ul);
    }
    box.append(s);
  }

  /* ======================================================================
     ארכיון
     ====================================================================== */
  let arFilter = 'all', arDomain = '', arQuery = '';
  const openIds = new Set();
  const FILTERS = [['all', 'הכל'], ['fav', '★ מועדפים'], ['knowledge', 'ידע'], ['quotes', 'ציטוטים'], ['answers', 'התשובות שלי']];
  const fb = $('#ar-filters');
  FILTERS.forEach(([k, l]) => {
    const b = el('button', null, l); b.type = 'button'; b.dataset.f = k; b.setAttribute('aria-pressed', k === arFilter);
    b.addEventListener('click', () => { arFilter = k; $$('#ar-filters button').forEach(x => x.setAttribute('aria-pressed', x.dataset.f === k)); renderArchive(); });
    fb.append(b);
  });
  Object.entries(DOMAINS).forEach(([k, l]) => { const o = el('option', null, l); o.value = k; $('#ar-domain').append(o); });
  $('#ar-domain').addEventListener('change', e => { arDomain = e.target.value; renderArchive(); });
  let sT; $('#ar-search').addEventListener('input', e => { clearTimeout(sT); sT = setTimeout(() => { arQuery = e.target.value; renderArchive(); }, 150); });
  const hay = it => norm([it.title, it.question, it.content, it.why, it.how, it.en, it.he, it.keyword, it.keywordHe, it.example, it.exampleHe].join(' '));

  function renderArchive() {
    if ($('#view-archive').hidden) return;
    const body = $('#ar-body'); body.innerHTML = '';
    $('#qform').hidden = arFilter !== 'quotes';
    $('#ar-domain').hidden = arFilter === 'answers';
    const q = norm(arQuery.trim());
    if (arFilter === 'quotes') { renderQuotes(body, q); return; }
    if (arFilter === 'answers') { renderAnswers(body, q); return; }
    const all = itemsList();
    const list = all.filter(it => {
      if (arFilter === 'fav' && !it.favorite) return false;
      if ((arFilter === 'knowledge' || arFilter === 'english') && it.type !== arFilter) return false;
      if (arDomain && it.domain !== arDomain) return false;
      if (q && !hay(it).includes(q)) return false;
      return true;
    });
    const nDays = new Set(all.map(x => x.date)).size;
    $('#ar-count').textContent = all.length + ' פריטים מ-' + nDays + (nDays === 1 ? ' יום' : ' ימים');
    if (!list.length) {
      const s = el('div', 'state');
      s.append(el('h2', null, arFilter === 'fav' ? 'עוד אין מועדפים' : 'לא נמצאו תוצאות'), el('p', null, arFilter === 'fav' ? 'לחץ "למועדפים" על כרטיס כדי לשמור אותו כאן.' : 'נסה מילה אחרת או הסר את הסינון.'));
      body.append(s); return;
    }
    const shown = list.sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0).slice(0, 200);
    const groups = {}; shown.forEach(it => { (groups[it.date] = groups[it.date] || []).push(it); });
    Object.keys(groups).sort().reverse().forEach(d => {
      const sec = el('section', 'ar-day');
      const h = el('h3', null, weekday(d) + ', ' + heDate(d)); if (S.days[d] && S.days[d].topic) h.append(el('small', null, S.days[d].topic));
      sec.append(h);
      groups[d].sort((a, b) => a.type === b.type ? (a.order || 0) - (b.order || 0) : (a.type === 'knowledge' ? -1 : 1)).forEach(it => sec.append(archiveItem(it)));
      body.append(sec);
    });
    if (list.length > shown.length) body.append(el('p', 'nextrev', 'מוצגות 200 התוצאות הראשונות. צמצם בעזרת חיפוש או סינון.'));
  }

  function archiveItem(it) {
    const isEn = it.type === 'english';
    const d = el('details', 'ar-item'); if (openIds.has(it.id)) d.open = true;
    d.addEventListener('toggle', () => { if (d.open) openIds.add(it.id); else openIds.delete(it.id); });
    const s = el('summary');
    const t = el('span', 't' + (isEn ? ' ltr' : ''), isEn ? (it.en || '') : (it.title || '')); if (isEn) t.lang = 'en';
    s.append(chipFor(it), t); if (it.favorite) s.append(el('span', 'star', '★'));
    d.append(s);
    const inn = el('div', 'ar-in');
    if (isEn) {
      inn.append(el('p', 'he', it.he || ''), glossBox(it), playBtns(it.en));
      if (it.keyword) inn.append(kwBox(it));
      if (it.example) { const p = el('p', 'en-sm', it.example); p.lang = 'en'; inn.append(p); }
    } else {
      const b = el('div', 'body'); b.append(paras(it.content)); inn.append(b);
      if (it.why) { const f = el('div', 'facet'); f.append(el('span', 'lbl', 'למה זה חשוב'), paras(it.why)); inn.append(f); }
      if (it.how) { const f = el('div', 'facet'); f.append(el('span', 'lbl', 'איך משתמשים בזה'), paras(it.how)); inn.append(f); }
    }
    const a = el('div', 'actions');
    const fav = el('button', 'btn fav', it.favorite ? '★ במועדפים' : '☆ למועדפים'); fav.type = 'button'; fav.setAttribute('aria-pressed', !!it.favorite);
    fav.addEventListener('click', () => toggleFav(it)); a.append(fav);
    if (it.due) a.append(el('span', 'nextrev', 'חזרה הבאה: ' + heDate(it.due) + (it.due.slice(0, 4) !== today.slice(0, 4) ? ' ' + it.due.slice(0, 4) : '')));
    inn.append(a);
    if (!isEn) inn.append(deepenPanel(it));
    d.append(inn); return d;
  }

  function copyText(text, onFail) {
    const fail = () => { if (onFail) onFail(); else toast('ההעתקה אינה זמינה כאן. סמן את הטקסט והעתק ידנית.'); };
    try { navigator.clipboard.writeText(text).then(() => toast('הועתק'), fail); } catch (e) { fail(); }
  }
  function renderQuotes(body, q) {
    const all = Object.values(S.quotes).sort((a, b) => (a.date || '') < (b.date || '') ? 1 : -1);
    const list = all.filter(x => (!arDomain || x.domain === arDomain) && (!q || norm([x.text, x.source, x.note].join(' ')).includes(q)));
    $('#ar-count').textContent = all.length + ' ציטוטים ורעיונות בבנק';
    if (!list.length) { const s = el('div', 'state'); s.append(el('h2', null, all.length ? 'לא נמצאו ציטוטים' : 'הבנק עוד ריק'), el('p', null, 'ציטוטים מהתדריכים נאספים כאן, ואפשר להוסיף גם משלך.')); body.append(s); return; }
    const w = el('div', 'qlist');
    list.forEach(x => {
      const f = el('figure', 'quote');
      const bq = el('blockquote', hasLatin(x.text) ? 'ltr' : null, x.text || ''); if (hasLatin(x.text)) bq.lang = 'en';
      f.append(bq);
      if (x.source) f.append(el('figcaption', null, '— ' + x.source));
      if (x.note) f.append(el('p', 'he', x.note));
      const acts = el('div', 'acts');
      acts.append(el('span', 'nextrev', (x.mine ? 'נוסף על ידך · ' : '') + (x.date ? heDate(x.date) : '')));
      const btns = el('div', 'play');
      const c = el('button', 'pbtn', 'העתק'); c.type = 'button'; c.addEventListener('click', () => copyText((x.text || '') + (x.source ? ' (' + x.source + ')' : ''))); btns.append(c);
      if (x.mine) { const del = el('button', 'pbtn', 'מחק'); del.type = 'button'; del.addEventListener('click', () => { if (del.dataset.armed) { delete S.quotes[x.id]; save(); renderArchive(); toast('הציטוט נמחק'); } else { del.dataset.armed = '1'; del.textContent = 'לחץ שוב למחיקה'; } }); btns.append(del); }
      acts.append(btns); f.append(acts); w.append(f);
    });
    body.append(w);
  }
  function renderAnswers(body, q) {
    const all = Object.values(S.answers).sort((a, b) => a.date < b.date ? 1 : -1);
    const list = all.filter(x => !q || norm([x.question, x.text].join(' ')).includes(q));
    $('#ar-count').textContent = all.length + ' תשובות ביומן ההשקפה';
    if (!list.length) { const s = el('div', 'state'); s.append(el('h2', null, 'יומן ההשקפה עוד ריק'), el('p', null, 'ענה על "שאלה למחשבה" במסך היום, והתשובות שלך יישמרו כאן.')); body.append(s); return; }
    list.forEach(x => { const d = el('div', 'ansitem'); d.append(el('span', 'rv-from', weekday(x.date) + ', ' + heDate(x.date)), el('p', 'q', x.question || ''), paras(x.text)); body.append(d); });
  }
  $('#q-save').addEventListener('click', () => {
    const t = $('#q-text').value.trim(), src = $('#q-source').value.trim();
    if (!t) { toast('כתוב קודם את הציטוט.'); $('#q-text').focus(); return; }
    const id = 'my-' + Date.now().toString(36);
    S.quotes[id] = { id, text: t, source: src, date: today, mine: true, domain: arDomain || '' };
    if (save()) { $('#q-text').value = ''; $('#q-source').value = ''; $('#qform').open = false; renderArchive(); toast('נשמר לבנק הציטוטים'); }
  });

  /* ======================================================================
     התקדמות
     ====================================================================== */
  let quiz = null;
  function activityMap() {
    const m = {};
    itemsList().forEach(it => ((it.review && it.review.history) || []).forEach(h => { if (h && h.date) m[h.date] = (m[h.date] || 0) + 1; }));
    Object.values(S.answers).forEach(a => { if (a.date) m[a.date] = (m[a.date] || 0) + 1; });
    Object.values(S.requests).forEach(r => { try { const d = isoLocal(new Date(r.createdAt)); m[d] = (m[d] || 0) + 1; } catch (e) { /* תאריך פגום */ } });
    return m;
  }
  function streaks(m) {
    let cur = 0, d = m[today] ? today : addDays(today, -1); while (m[d]) { cur++; d = addDays(d, -1); }
    let best = 0, run = 0, prev = null; Object.keys(m).sort().forEach(x => { run = (prev && addDays(prev, 1) === x) ? run + 1 : 1; best = Math.max(best, run); prev = x; });
    return { cur, best, activeToday: !!m[today] };
  }
  function tile(parent, num, label, sub, cls) { const t = el('div', 'tile' + (cls ? ' ' + cls : '')); t.append(el('b', null, num), el('span', null, label), el('small', null, sub)); parent.append(t); }
  const latestWeekly = () => Object.values(S.weekly).sort((a, b) => a.week < b.week ? 1 : -1)[0] || null;

  function renderProgress() {
    if ($('#view-progress').hidden) return;
    const b = $('#pg-body'); b.innerHTML = '';
    const all = itemsList();
    const m = activityMap(), st = streaks(m);
    const rated = all.filter(it => it.review && it.review.history && it.review.history.length);
    const mastered = all.filter(it => ((it.review && it.review.easyCount) || 0) >= 1).length;
    $('#pg-sub').textContent = st.activeToday ? 'כבר למדת היום. המשך כך.' : 'עוד לא תרגלת היום. דקה אחת מספיקה כדי לשמור על הרצף.';
    const tiles = el('div', 'tiles');
    tile(tiles, String(st.cur), st.cur === 1 ? 'יום ברצף' : 'ימים ברצף', 'שיא: ' + st.best, 'streak');
    tile(tiles, String(rated.length), 'פריטים שתרגלת', 'מתוך ' + all.length);
    tile(tiles, String(mastered), 'בשליטה', 'סומנו "קל"');
    b.append(tiles);

    const hs = el('section', 'pg-sec'); hs.append(el('h2', null, 'פעילות בחמשת השבועות האחרונים'));
    const grid = el('div', 'heat'); grid.setAttribute('role', 'img'); grid.setAttribute('aria-label', 'מפת פעילות יומית');
    ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].forEach(x => grid.append(el('span', 'dh', x)));
    const dow = parseISO(today).getDay(); const start = addDays(today, -dow - 28);
    for (let i = 0; i < 35; i++) {
      const d = addDays(start, i); const n = m[d] || 0; const c = el('span', 'c');
      if (d > today) c.classList.add('future'); else if (n >= 10) c.classList.add('l3'); else if (n >= 3) c.classList.add('l2'); else if (n >= 1) c.classList.add('l1');
      if (d === today) c.classList.add('now');
      c.title = heDate(d) + ': ' + (n ? n + ' פעולות' : 'ללא פעילות'); grid.append(c);
    }
    const lg = el('div', 'legend'); lg.append(el('span', null, 'פחות')); ['', 'l1', 'l2', 'l3'].forEach(k => lg.append(el('i', k))); lg.append(el('span', null, 'יותר'));
    hs.append(grid, lg); b.append(hs);

    const ds = el('section', 'pg-sec');
    ds.append(el('h2', null, 'זכירה לפי תחום'), el('p', 'nextrev', 'לפי הדירוגים שלך ב-30 הימים האחרונים. "קל" שווה 100%, "בינוני" 60%, "קשה" 0%.'));
    const since = addDays(today, -30), agg = {};
    all.forEach(it => {
      const key = it.type === 'english' ? 'english' : it.domain;
      ((it.review && it.review.history) || []).forEach(h => { if (!h || h.date < since) return; const sc = SCORE[h.rating]; if (sc == null) return; const a = agg[key] = agg[key] || { n: 0, sum: 0 }; a.n++; a.sum += sc; });
    });
    const names = Object.assign({}, DOMAINS, { english: 'אנגלית' });
    const keys = Object.keys(agg).sort((x, y) => agg[x].sum / agg[x].n - agg[y].sum / agg[y].n);
    if (!keys.length) ds.append(el('p', 'he', 'עוד אין דירוגים. דרג כרטיסים במסך "היום" ובחזרה, והתמונה תתמלא כאן.'));
    else {
      const rows = el('div', 'drows');
      keys.forEach(k => {
        const a = agg[k], pct = Math.round(a.sum / a.n * 100);
        const r = el('div', 'drow'); r.style.setProperty('--d', 'var(--c-' + (k === 'english' ? 'science' : (DOMAINS[k] ? k : 'current')) + ')');
        const bar = el('div', 'dbar'); const f = el('i'); f.style.width = pct + '%'; bar.append(f);
        const pc = el('span', 'pc', pct + '% · ' + a.n);
        if (a.n >= 2 && pct < 60) pc.prepend(el('span', 'pill weak', 'לחזק'), document.createTextNode(' '));
        r.append(el('span', 'nm', names[k] || k), bar, pc); rows.append(r);
      });
      ds.append(rows);
      const untested = Object.keys(names).filter(k => !agg[k] && k !== 'current');
      if (untested.length) ds.append(el('p', 'nextrev', 'עוד לא תורגלו: ' + untested.map(k => names[k]).join(', ')));
    }
    b.append(ds);
    renderWeekly(b);
  }

  function renderWeekly(b) {
    const s = el('section', 'pg-sec'); s.append(el('h2', null, 'סיכום וחידון שבועי'));
    const wk = latestWeekly();
    if (!wk) { s.append(el('p', 'he', 'הסיכום השבועי מגיע בכל יום שישי יחד עם התדריך: חמשת הרעיונות החשובים של השבוע, וחידון קצר עליהם.')); b.append(s); return; }
    if (quiz && quiz.week !== wk.week) quiz = null;
    s.append(el('span', 'rv-from', (wk.title || '') + ' · ' + heDate(wk.week) + ' עד ' + heDate(wk.weekEnd || addDays(wk.week, 6))));
    if (wk.note) s.append(el('p', 'he', wk.note));
    if (Array.isArray(wk.ideas) && wk.ideas.length) {
      s.append(el('span', 'eyebrow', 'הרעיונות של השבוע'));
      const ul = el('ul', 'ideas');
      wk.ideas.forEach(x => { const li = el('li'); li.append(chipFor({ domain: x.domain }), el('b', null, x.title || ''), el('p', null, x.text || '')); ul.append(li); });
      s.append(ul);
    }
    const qs = Array.isArray(wk.quiz) ? wk.quiz : [];
    if (qs.length) {
      if (!quiz) {
        const row = el('div', 'ans-row');
        const go = el('button', 'primary', 'התחל חידון · ' + qs.length + ' שאלות'); go.type = 'button';
        go.addEventListener('click', () => { quiz = { week: wk.week, i: 0, picked: null, score: 0, saved: false }; renderProgress(); });
        row.append(go);
        if (wk.results) row.append(el('span', 'nextrev', 'הציון האחרון: ' + wk.results.score + ' מתוך ' + wk.results.total + ' · ' + heDate(wk.results.date)));
        s.append(row);
      } else s.append(renderQuiz(wk, qs));
    }
    b.append(s);
  }

  function renderQuiz(wk, qs) {
    const box = el('div', 'quiz');
    if (quiz.i >= qs.length) {
      if (!quiz.saved) {
        quiz.saved = true;
        const res = { score: quiz.score, total: qs.length, date: today };
        const w = S.weekly[wk.week]; w.results = res; w.attempts = (Array.isArray(w.attempts) ? w.attempts : []).concat([res]).slice(-20); save();
      }
      const pct = quiz.score / qs.length;
      box.append(el('span', 'eyebrow', 'סיום החידון'), el('p', 'q', quiz.score + ' מתוך ' + qs.length),
        el('p', 'he', pct >= 0.8 ? 'מצוין. הידע של השבוע מבוסס היטב.' : pct >= 0.5 ? 'יפה. כדאי לעבור שוב בארכיון על הנושאים שבהם טעית.' : 'כדאי לחזור על הרעיונות של השבוע בארכיון ובחזרה.'));
      const row = el('div', 'ans-row');
      const close = el('button', 'primary', 'סגור'); close.type = 'button'; close.addEventListener('click', () => { quiz = null; renderProgress(); });
      const again = el('button', 'ghost', 'נסה שוב'); again.type = 'button'; again.addEventListener('click', () => { quiz = { week: wk.week, i: 0, picked: null, score: 0, saved: false }; renderProgress(); });
      row.append(close, again); box.append(row); return box;
    }
    const q = qs[quiz.i];
    const meta = el('div', 'flash-meta'); const bar = el('div', 'bar'); const f = el('i'); f.style.width = (quiz.i / qs.length * 100) + '%'; bar.append(f);
    meta.append(el('span', null, (quiz.i + 1) + ' / ' + qs.length), bar); box.append(meta);
    const qp = el('p', 'q', q.q || ''); if (hasLatin(q.q)) { qp.style.direction = 'ltr'; qp.style.textAlign = 'left'; }
    box.append(qp);
    const opts = el('div', 'opts');
    (q.options || []).forEach((o, idx) => {
      const btn = el('button', 'opt' + (q.ltr ? ' ltr' : ''), o); btn.type = 'button'; if (q.ltr) btn.lang = 'en';
      if (quiz.picked != null) { btn.disabled = true; if (idx === q.answer) btn.classList.add('right'); else if (idx === quiz.picked) btn.classList.add('wrong'); }
      btn.addEventListener('click', () => { if (quiz.picked != null) return; quiz.picked = idx; if (idx === q.answer) quiz.score++; renderProgress(); });
      opts.append(btn);
    });
    box.append(opts);
    if (quiz.picked != null) {
      box.append(el('p', 'he', (quiz.picked === q.answer ? 'נכון. ' : 'לא בדיוק. ') + (q.explain || '')));
      const nx = el('button', 'primary', quiz.i + 1 < qs.length ? 'לשאלה הבאה' : 'לתוצאה'); nx.type = 'button';
      nx.addEventListener('click', () => { quiz.i++; quiz.picked = null; renderProgress(); }); box.append(nx);
    }
    return box;
  }

  /* ======================================================================
     הגדרות: מראה, גיבוי, שחזור, ייבוא, בקשות
     ====================================================================== */
  function applyTheme() {
    const t = S.settings.theme;
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }
  $$('#theme-seg button').forEach(b => b.addEventListener('click', () => { S.settings.theme = b.dataset.themeSet; save(); applyTheme(); renderSettings(); }));

  function renderSettings() {
    if ($('#view-settings').hidden) return;
    renderAutoSettings(); renderVoiceSettings();
    const th = S.settings.theme || 'auto';
    $$('#theme-seg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeSet === th));
    let size = 0; try { size = new Blob([JSON.stringify(S)]).size; } catch (e) { /* ignore */ }
    const lb = S.settings.lastBackup;
    $('#storage-info').textContent = Object.keys(S.days).length + ' ימים · ' + Object.keys(S.items).length + ' פריטים · ' + Math.max(1, Math.round(size / 1024)) + ' ק"ב בדפדפן' + (lb ? ' · גיבוי אחרון: ' + heDate(lb) : ' · עוד לא בוצע גיבוי');
    const pend = requestsList().filter(r => r.status !== 'done');
    $('#req-info').textContent = pend.length ? pend.length + ' בקשות ממתינות' : 'אין בקשות ממתינות';
  }

  $('#btn-backup').addEventListener('click', () => {
    try {
      const data = JSON.stringify({ app: 'daat-yomit', kind: 'backup', version: 1, exportedAt: new Date().toISOString(), data: S }, null, 1);
      const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = 'daat-yomit-backup-' + today + '.json';
      document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000);
      S.settings.lastBackup = today; save(); renderSettings(); toast('קובץ הגיבוי נשמר במכשיר');
    } catch (e) { toast('יצירת הגיבוי נכשלה בדפדפן הזה.'); }
  });

  let pendingRestore = null;
  $('#restore-file').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const o = JSON.parse(r.result); const d = o && o.kind === 'backup' ? o.data : o;
        if (!d || d.v !== 1 || typeof d.items !== 'object') throw new Error('bad');
        pendingRestore = d;
        $('#restore-text').textContent = 'גיבוי' + (o.exportedAt ? ' מתאריך ' + heDate(isoLocal(new Date(o.exportedAt))) : '') + ', עם ' + Object.keys(d.days || {}).length + ' ימים ו-' + Object.keys(d.items || {}).length + ' פריטים. השחזור יחליף את כל הנתונים שבמכשיר הזה. להמשיך?';
        $('#restore-confirm').hidden = false;
      } catch (err) { toast('הקובץ לא זוהה כגיבוי של דעת יומית.'); }
    };
    r.onerror = () => toast('קריאת הקובץ נכשלה.');
    r.readAsText(f);
  });
  $('#restore-no').addEventListener('click', () => { pendingRestore = null; $('#restore-confirm').hidden = true; });
  $('#restore-yes').addEventListener('click', () => {
    if (!pendingRestore) return;
    S = fromData(pendingRestore); mergeContent(CONTENT, true); save();
    pendingRestore = null; $('#restore-confirm').hidden = true;
    currentDate = pickDate(); answerDraft = { date: null, text: '', dirty: false }; practice = null; rsess = null; quiz = null;
    applyTheme(); renderAll(); toast('הנתונים שוחזרו');
  });

  $('#btn-import').addEventListener('click', () => {
    const st = $('#import-status');
    let raw = $('#import-text').value.trim();
    if (!raw) { st.textContent = 'הדבק קודם את בלוק התדריך.'; return; }
    const a = raw.indexOf('{'), z = raw.lastIndexOf('}');
    if (a < 0 || z < a) { st.textContent = 'לא נמצא בלוק תקין. ודא שהעתקת אותו במלואו, מהסוגר הראשון ועד האחרון.'; return; }
    let o; try { o = JSON.parse(raw.slice(a, z + 1)); } catch (e) { st.textContent = 'הבלוק אינו תקין. ודא שהעתקת אותו במלואו, מהסוגר הראשון ועד האחרון.'; return; }
    if (o && o.kind === 'backup') { st.textContent = 'זהו קובץ גיבוי. השתמש ב"שחזור נתונים".'; return; }
    const c = mergeContent(o, false);
    if (!c.days && !c.items && !c.quotes && !c.weekly && !c.requests) { st.textContent = 'לא נמצא תוכן לייבוא בבלוק.'; return; }
    if (!save()) return;
    currentDate = pickDate(); practice = null;
    $('#import-text').value = '';
    const parts = []; if (c.days) parts.push(c.days === 1 ? 'יום אחד' : c.days + ' ימים'); if (c.items) parts.push(c.items + ' פריטים'); if (c.quotes) parts.push(c.quotes + ' ציטוטים'); if (c.weekly) parts.push('סיכום שבועי'); if (c.requests) parts.push(c.requests + ' בקשות נענו');
    st.textContent = 'יובאו: ' + parts.join(', ') + (c.skipped ? ' · ' + c.skipped + ' רשומות לא תקינות דולגו' : '');
    renderAll(); toast('התדריך יובא');
  });

  $('#btn-copy-req').addEventListener('click', () => {
    const pend = requestsList().filter(r => r.status !== 'done');
    if (!pend.length) { toast('אין בקשות ממתינות.'); return; }
    const text = 'בקשות פתוחות מדעת יומית:\n' + pend.map(r => '[' + r.id + '] ' + (r.itemTitle ? '(בהקשר: ' + r.itemTitle + ') ' : '') + r.text).join('\n');
    const fbk = $('#req-fallback');
    copyText(text, () => { fbk.value = text; fbk.hidden = false; fbk.focus(); fbk.select(); toast('סמן את הטקסט והעתק ידנית.'); });
  });

  /* ======================================================================
     חיבור ל-Claude API: תדריך בוקר אוטומטי ושאלות העמקה
     המפתח נשמר בנפרד מהנתונים, ואינו נכנס לקובץ הגיבוי.
     ====================================================================== */
  const KEY_API = 'daat-yomit-apikey';
  const LOCK = 'daat-yomit-genlock';
  const MODELS = [['claude-sonnet-5-5', 'Claude Sonnet 5.5 · מומלץ'], ['claude-opus-5-5', 'Claude Opus 5.5 · מעמיק ויקר יותר'], ['claude-haiku-5-5', 'Claude Haiku 5.5 · מהיר וחסכוני']];
  function getKey() { try { return localStorage.getItem(KEY_API) || ''; } catch (e) { return ''; } }
  function setKey(k) { try { if (k) localStorage.setItem(KEY_API, k); else localStorage.removeItem(KEY_API); return true; } catch (e) { return false; } }
  const st = () => S.settings;

  /* קריאה ל-Claude בסטרימינג: התשובה מגיעה תוך כדי כתיבה, כך שהחיבור לא "שותק" ולא מתנתק בטלפון */
  async function streamOnce(key, body, onProgress) {
    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify(Object.assign({}, body, { stream: true }))
      });
    } catch (e) { throw { code: 'network' }; }
    if (!res.ok) { let jj = null; try { jj = await res.json(); } catch (e) { /* גוף ריק */ } throw { code: 'http', status: res.status, message: (jj && jj.error && jj.error.message) || '' }; }
    if (!res.body || !res.body.getReader) {
      const t = await res.text();
      return parseSSE(t, onProgress);
    }
    const reader = res.body.getReader(), dec = new TextDecoder();
    const st8 = { blocks: [], json: {}, stop: null, chars: 0, buf: '' };
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        st8.buf += dec.decode(value, { stream: true });
        let i;
        while ((i = st8.buf.indexOf('\n\n')) >= 0) { handleEvent(st8, st8.buf.slice(0, i), onProgress); st8.buf = st8.buf.slice(i + 2); }
      }
    } catch (e) { if (e && e.code) throw e; throw { code: 'network' }; }
    if (st8.buf.trim()) handleEvent(st8, st8.buf, onProgress);
    if (!st8.stop) throw { code: 'network' };
    return { content: st8.blocks.filter(Boolean), stop: st8.stop };
  }
  function parseSSE(text, onProgress) {
    const st8 = { blocks: [], json: {}, stop: null, chars: 0 };
    text.split('\n\n').forEach(ev => handleEvent(st8, ev, onProgress));
    return { content: st8.blocks.filter(Boolean), stop: st8.stop || 'end_turn' };
  }
  function handleEvent(st8, raw, onProgress) {
    const line = raw.split('\n').filter(l => l.startsWith('data:')).map(l => l.slice(5).trim()).join('');
    if (!line) return;
    let ev; try { ev = JSON.parse(line); } catch (e) { return; }
    if (ev.type === 'content_block_start') {
      const b = JSON.parse(JSON.stringify(ev.content_block || {}));
      if (b.type === 'server_tool_use' || b.type === 'tool_use') { st8.json[ev.index] = ''; }
      if (b.type === 'text' && !b.text) b.text = '';
      if (b.type === 'thinking' && !b.thinking) b.thinking = '';
      st8.blocks[ev.index] = b;
    } else if (ev.type === 'content_block_delta') {
      const b = st8.blocks[ev.index], d = ev.delta || {}; if (!b) return;
      if (d.type === 'text_delta') { b.text = (b.text || '') + d.text; st8.chars += d.text.length; if (onProgress) onProgress(st8.chars); }
      else if (d.type === 'thinking_delta') { b.thinking = (b.thinking || '') + (d.thinking || ''); }
      else if (d.type === 'signature_delta') { b.signature = (b.signature || '') + (d.signature || ''); }
      else if (d.type === 'input_json_delta') st8.json[ev.index] = (st8.json[ev.index] || '') + (d.partial_json || '');
      else if (d.type === 'citations_delta') { (b.citations = b.citations || []).push(d.citation); }
    } else if (ev.type === 'content_block_stop') {
      const b = st8.blocks[ev.index];
      if (b && st8.json[ev.index] !== undefined) { try { b.input = st8.json[ev.index] ? JSON.parse(st8.json[ev.index]) : (b.input || {}); } catch (e) { /* קלט חלקי */ } delete st8.json[ev.index]; }
    } else if (ev.type === 'message_delta') {
      if (ev.delta && ev.delta.stop_reason) st8.stop = ev.delta.stop_reason;
    } else if (ev.type === 'error') {
      const m = (ev.error && ev.error.message) || '';
      throw { code: 'http', status: (ev.error && ev.error.type === 'overloaded_error') ? 529 : 500, message: m };
    }
  }
  async function callClaude(opts) {
    const key = getKey(); if (!key) throw { code: 'nokey' };
    const base = { model: st().model || MODELS[0][0], max_tokens: opts.maxTokens || 2000, messages: opts.messages };
    if (opts.system) base.system = opts.system;
    if (opts.search) base.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: opts.search }];
    let msgs = opts.messages.slice(), content = [], soFar = 0, noThink = true;
    for (let round = 0; round < 5; round++) {
      let r;
      try { r = await streamOnce(key, Object.assign({}, base, noThink ? { thinking: { type: 'disabled' } } : {}, { messages: msgs }), n => { if (opts.onProgress) opts.onProgress(soFar + n); }); }
      catch (e) { if (noThink && e && e.code === 'http' && e.status === 400 && /thinking/i.test(e.message || '')) { noThink = false; round--; continue; } throw e; }
      soFar += textOf(r.content).length;
      content = content.concat(r.content);
      if (r.stop === 'pause_turn') { msgs = msgs.concat([{ role: 'assistant', content: r.content }]); continue; }
      return { content, stop: r.stop };
    }
    return { content, stop: 'pause_turn' };
  }
  const textOf = content => content.filter(b => b && b.type === 'text').map(b => b.text).join('');
  function errMessage(e) {
    if (!e) return 'אירעה שגיאה לא צפויה.';
    if (e.code === 'nokey') return 'לא הוזן מפתח API. הזן אותו בהגדרות.';
    if (e.code === 'network') return 'החיבור ל-Anthropic נקטע באמצע. ודא שיש קליטה טובה ושהאפליקציה נשארת פתוחה על המסך עד הסיום, ונסה שוב.';
    if (e.code === 'cut') return 'התדריך נקטע באמצע הכתיבה. נסה שוב.';
    if (e.code === 'parse') return 'התשובה שהתקבלה לא הייתה במבנה תקין. נסה שוב.';
    if (e.code === 'http') {
      const m = String(e.message || '');
      if (e.status === 401) return 'מפתח ה-API שגוי או שבוטל. בדוק אותו בהגדרות.';
      if (e.status === 403) return 'למפתח אין הרשאה לפעולה הזאת. בדוק את הגדרות החשבון ב-Claude Console.';
      if (e.status === 404) return 'המודל שנבחר אינו זמין בחשבון שלך. בחר מודל אחר בהגדרות.';
      if (e.status === 400 && /web search/i.test(m)) return 'חיפוש הרשת אינו מופעל בחשבון ה-API. הפעל אותו ב-Claude Console, תחת Settings › Capabilities.';
      if (e.status === 400 && /credit|billing|balance/i.test(m)) return 'אין מספיק יתרה בחשבון ה-API. טען יתרה ב-Claude Console.';
      if (e.status === 429) return 'הגעת למגבלת השימוש של החשבון. נסה שוב מאוחר יותר.';
      if (e.status >= 500) return 'השירות של Anthropic עמוס כרגע. נסה שוב בעוד כמה דקות.';
      return 'הבקשה נכשלה (' + e.status + ')' + (m ? ': ' + m : '.');
    }
    return 'אירעה שגיאה לא צפויה.';
  }
  function parseJSON(text) {
    const t = String(text || '').replace(/```json|```/g, '');
    const a = t.indexOf('{'), z = t.lastIndexOf('}');
    if (a < 0 || z < a) throw { code: 'parse' };
    try { return stripCites(JSON.parse(t.slice(a, z + 1))); } catch (e) { throw { code: 'parse' }; }
  }
  const clean = s => String(s || '').replace(/\*\*|__|^#+\s*/gm, '').replace(/^\s*[-•]\s+/gm, '').trim();

  /* ---------- הפרומפט של תדריך הבוקר ---------- */
  const SYS_BRIEF = `אתה העורך של "דעת יומית", תדריך ידע יומי אישי לאדם בישראל שמבקש להחכים, לגבש השקפה צלולה ולהוביל ציבורית.
סגנון: עברית תקנית, בוגרת ומכובדת. כשפונים לקורא, בלשון זכר. עומק של מרצה מעולה, לא אקדמי ולא פשטני. נימה מעט תורנית ומכובדת היכן שמתאים, עם מקורות מדויקים (ספר, פרק, דף). בלי הקדמות, בלי סגנון שיחה, בלי אימוג'י, בלי Markdown ובלי תגיות ציטוט (cite) או הפניות ממוספרות בתוך הטקסט.
דיוק: כל עובדה, מספר, תאריך וציטוט חייבים להיות נכונים. את האקטואליה אמת בחיפוש ברשת. ציטוט שאינך בטוח בנוסחו או במקורו, אל תכלול.
ניטרליות: בנושאים שבמחלוקת פוליטית הצג עובדות ואת הטיעונים החזקים של כמה צדדים, בלי לנקוט עמדה ובלי לשפוט מפלגה או אדם.
הפלט הסופי: אובייקט JSON יחיד ותקין, בלי שום טקסט לפניו או אחריו.`;

  function sundayOf(iso) { return addDays(iso, -parseISO(iso).getDay()); }
  function buildContext() {
    const since60 = addDays(today, -60), since30 = addDays(today, -30), since7 = addDays(today, -7);
    const all = itemsList();
    const recentK = all.filter(i => i.type === 'knowledge' && i.date >= since60).map(i => i.title).filter(Boolean).slice(-150);
    const recentE = all.filter(i => i.type === 'english' && i.date >= since60).map(i => i.keyword).filter(Boolean).slice(-150);
    const recentModels = Object.values(S.extras).filter(x => x.date >= since60 && x.model).map(x => x.model.title);
    const recentTopics = daysList().filter(d => d.date >= since60).map(d => d.topic).slice(0, 30);
    const agg = {};
    all.forEach(it => { const key = it.type === 'english' ? 'english' : it.domain; ((it.review && it.review.history) || []).forEach(h => { if (!h || h.date < since30) return; const sc = SCORE[h.rating]; if (sc == null) return; const a = agg[key] = agg[key] || { n: 0, sum: 0 }; a.n++; a.sum += sc; }); });
    const weak = Object.keys(agg).filter(k => agg[k].n >= 2 && agg[k].sum / agg[k].n < 0.6);
    const seen7 = new Set(all.filter(i => i.type === 'knowledge' && i.date >= since7).map(i => i.domain));
    const neglected = Object.keys(DOMAINS).filter(k => !seen7.has(k));
    const pending = requestsList().filter(r => r.status !== 'done').slice(0, 3).map(r => ({ id: r.id, text: r.text, context: r.itemTitle || '' }));
    const isFriday = parseISO(today).getDay() === 5;
    const week = sundayOf(today);
    const weekItems = isFriday ? all.filter(i => i.type === 'knowledge' && i.date >= week && i.date < today).map(i => i.title + ' (' + (DOMAINS[i.domain] || '') + ')') : [];
    return { recentK, recentE, recentModels, recentTopics, weak, neglected, pending, isFriday, week, weekItems };
  }
  function promptHead(c) {
    return `היום ${weekday(today)}, ${gregDate(today)} (${hebDate(today)}). התאריך בפורמט ISO: ${today}.
${c.extra ? 'זהו תדריך נוסף שהלומד ביקש היום, מעבר לתדריך היומי. בחר נושא אקטואלי אחר מכל הנושאים שכבר הופיעו, וגוון בתחומים.\n' : ''}`;
  }
  /* חלק א: נושא, הקדמה, להעמקה ו-7 נקודות ידע (עם חיפוש ברשת) */
  function corePrompt(c) {
    const doms = Object.entries(DOMAINS).map(([k, v]) => k + ' = ' + v).join(', ');
    return promptHead(c) + `
שלב 1: חפש ברשת את החדשות המרכזיות של היום בישראל ובעולם, בעברית ובאנגלית. בחר נושא אקטואלי מרכזי אחד, עמוק ולא רכילותי. הנושא משתנה לפי המציאות.
שלב 2: כתוב את חלק הידע של התדריך במבנה ה-JSON שלהלן. תמציתי ומדויק: כל פסקה 2-3 משפטים.

מצב הלומד:
- תחומים חלשים (לתת עדיפות, בנקודה חדשה ופשוטה יותר): ${c.weak.length ? c.weak.join(', ') : 'אין עדיין'}
- תחומים שלא הופיעו בשבוע האחרון: ${c.neglected.join(', ') || 'אין'}
- נושאים אקטואליים מהזמן האחרון (לא לחזור): ${c.recentTopics.join(' | ') || 'אין'}
- נקודות ידע שכבר נלמדו (אסור לחזור עליהן): ${c.recentK.join(' | ') || 'אין'}
- מודלי חשיבה שכבר הוצגו: ${c.recentModels.join(' | ') || 'אין'}
- בקשות "תלמד אותי על..." ממתינות: ${c.pending.length ? JSON.stringify(c.pending) : 'אין'}

כללים:
- knowledge: בדיוק 4 פריטים (3 נוספים ייכתבו בשלב הבא), ב-4 תחומים שונים. לפחות 2 קשורים ישירות לנושא האקטואלי. תחומים חלשים ומוזנחים מקבלים עדיפות.
- לכל בקשה ממתינה הקדש נקודת ידע אחת, עם השדה requestId שמכיל את מזהה הבקשה, והזכר זאת בקצרה ב-intro. רשום את מזהי הבקשות שנענו ב-requestsDone.
- ערכי domain המותרים: ${doms}.
- פסקאות בתוך שדה טקסט מופרדות ב-\\n.

מבנה הפלט:
{
  "day": {"topic": "כותרת הנושא, עד 12 מילים", "intro": "2-3 משפטים"},
  "extras": {"model": {"title": "מודל חשיבה", "body": "הסבר עם דוגמה, 2 פסקאות"}, "question": "שאלה למחשבה שמחייבת לגבש עמדה", "challenge": "אתגר דיבור של דקה, עם עצה"},
  "knowledge": [{"domain": "", "title": "", "question": "שאלת חזרה קצרה", "content": "2-3 פסקאות קצרות", "why": "משפט או שניים", "how": "משפט או שניים: איך משתמשים בזה בשיחה, בנאום או בהנהגה", "deepen": {"directions": ["כיוון העמקה", "כיוון העמקה"], "sources": ["מקור מדויק"]}, "requestId": ""}],
  "requestsDone": []
}`;
  }
  /* חלק א2: עוד 3 נקודות ידע (בלי חיפוש), כדי שכל קריאה תהיה קצרה ולא תיקטע */
  function morePrompt(c, core) {
    const doms = Object.entries(DOMAINS).map(([k, v]) => k + ' = ' + v).join(', ');
    const used = core.knowledge.map(k => k.domain + ': ' + k.title).join(' | ');
    return promptHead(c) + `
הנושא האקטואלי של התדריך: ${core.day.topic}
${core.day.intro || ''}
נקודות הידע שכבר נכתבו בתדריך הזה: ${used}

כתוב עוד בדיוק 3 נקודות ידע, ב-3 תחומים שונים זה מזה ושונים מהתחומים שכבר נכתבו. תמציתי ומדויק: כל פסקה 2-3 משפטים.
- תחומים חלשים (עדיפות): ${c.weak.length ? c.weak.join(', ') : 'אין עדיין'}
- תחומים שלא הופיעו בשבוע האחרון: ${c.neglected.join(', ') || 'אין'}
- נקודות שכבר נלמדו (אסור לחזור): ${c.recentK.join(' | ') || 'אין'}
- ערכי domain המותרים: ${doms}.
- פסקאות בתוך שדה טקסט מופרדות ב-\\n.

החזר JSON בלבד במבנה:
{"knowledge": [{"domain": "", "title": "", "question": "שאלת חזרה קצרה", "content": "2-3 פסקאות קצרות", "why": "משפט או שניים", "how": "משפט או שניים", "deepen": {"directions": ["כיוון העמקה", "כיוון העמקה"], "sources": ["מקור מדויק"]}}]}`;
  }
  /* חלק ב: משפטי אנגלית, ציטוטים וסיכום שבועי (בלי חיפוש) */
  function langPrompt(c, core) {
    const doms = Object.keys(DOMAINS).join(', ');
    const kn = (core.knowledge || []).map(k => '- ' + k.title + ' (' + k.domain + ')').join('\n');
    return promptHead(c) + `
נושא התדריך: ${core.day && core.day.topic}
נקודות הידע בתדריך:
${kn}

כתוב את חלק ${EN_ON ? 'השפה' : 'הציטוטים'} של התדריך במבנה ה-JSON שלהלן.
${EN_ON ? `- מילות מפתח באנגלית שכבר נלמדו (אסור לחזור): ${c.recentE.join(' | ') || 'אין'}
- english: בדיוק 4 משפטים ברמה גבוהה ומתקדמת (C1), מעולמות המנהיגות, הניהול, הרטוריקה, הפילוסופיה והדיפלומטיה, וקשורים לנושא ולנקודות הידע. מילת המפתח חייבת להופיע ככתבה בתוך המשפט. אם יש שתי מילות מפתח, הפרד ביניהן ב-" · ".
- gloss: לכל משפט, פירוש מילה במילה של המשפט הראשי (en), לפי סדר המילים, בתבנית word=פירוש|word=פירוש. כל מילה במשפט מופיעה, בלי סימני פיסוק. ביטוי קבוע כיחידה אחת. a/an: (סתמי). the: ה־. מילת עזר בלי מקבילה: הסבר קצר בסוגריים.
` : ''}- quotes: 1 או 2 ציטוטים מאומתים בלבד, קצרים, ממקורות קלאסיים, מחז"ל, ממדינאים או מהוגים. אם אין ודאות בנוסח או במקור, אל תכלול.
- ערכי domain המותרים: ${doms}.
${c.isFriday ? '- היום יום שישי. צרף גם סיכום שבועי. נקודות הידע של השבוע: ' + (c.weekItems.concat((core.knowledge || []).map(k => k.title)).join(' | ') || 'אין') + '. ב-weekly: בדיוק 5 רעיונות, ו-6 עד 8 שאלות' + (EN_ON ? '; לפחות שאלה אחת על אנגלית עם "ltr": true' : '') + '; פזר את התשובות הנכונות בין המיקומים.' : ''}

מבנה הפלט:
{
${EN_ON ? '  "english": [{"domain": "", "en": "", "he": "", "gloss": "Word=פירוש|word=פירוש", "keyword": "", "keywordHe": "", "example": "משפט נוסף באנגלית עם מילת המפתח", "exampleHe": ""}],\n' : ''}  "quotes": [{"domain": "", "text": "", "source": "", "note": "איך משתמשים בציטוט"}],
  "weekly": ${c.isFriday ? '{"note": "משפט פתיחה לסיכום", "ideas": [{"domain": "", "title": "", "text": ""}], "quiz": [{"q": "", "options": ["", "", "", ""], "answer": 0, "explain": "", "ltr": false}]}' : 'null'}
}`;
  }

  function toBlock(o, c) {
    if (!o || !o.day || !o.day.topic || !Array.isArray(o.knowledge) || o.knowledge.length < 5 || (EN_ON && !c.extra && (!Array.isArray(o.english) || o.english.length < 3))) throw { code: 'parse' };
    const d = c.target || today, dom = x => DOMAINS[x] ? x : 'current';
    const items = [];
    o.knowledge.slice(0, 8).forEach((k, i) => {
      const it = { id: d + '-k' + (i + 1), date: d, type: 'knowledge', order: i + 1, domain: dom(k.domain), title: clean(k.title), question: clean(k.question), content: clean(k.content), why: clean(k.why), how: clean(k.how) };
      if (k.deepen && (Array.isArray(k.deepen.directions) || Array.isArray(k.deepen.sources))) it.deepen = { directions: (k.deepen.directions || []).map(clean).filter(Boolean), sources: (k.deepen.sources || []).map(clean).filter(Boolean) };
      if (k.requestId) it.requestId = String(k.requestId);
      items.push(it);
    });
    (EN_ON && Array.isArray(o.english) ? o.english : []).slice(0, 4).forEach((e, i) => {
      if (!e || !e.en) return;
      const it = { id: d + '-e' + (i + 1), date: d, type: 'english', order: i + 1, domain: dom(e.domain), title: e.keyword || '', en: e.en, he: e.he || '', keyword: e.keyword || '', keywordHe: e.keywordHe || '', example: e.example || '', exampleHe: e.exampleHe || '' };
      const g = parseGloss(e.gloss); if (g.length >= 2) it.gloss = g;
      items.push(it);
    });
    const block = {
      days: [{ date: d, topic: clean(o.day.topic), intro: clean(o.day.intro) }],
      extras: [Object.assign({ date: d }, o.extras && typeof o.extras === 'object' ? { model: o.extras.model ? { title: clean(o.extras.model.title), body: clean(o.extras.model.body) } : null, question: clean(o.extras.question), challenge: clean(o.extras.challenge) } : {})],
      items,
      quotes: (Array.isArray(o.quotes) ? o.quotes : []).slice(0, 3).filter(q => q && q.text).map((q, i) => ({ id: d + '-q' + (i + 1), date: d, domain: dom(q.domain), text: q.text, source: q.source || '', note: q.note || '', mine: false })),
      requestsDone: (Array.isArray(o.requestsDone) ? o.requestsDone : []).concat(items.map(i => i.requestId).filter(Boolean)).filter(id => S.requests[id])
    };
    if (c.isFriday && o.weekly && Array.isArray(o.weekly.quiz)) {
      const first = daysList().reverse()[0];
      const n = first ? Math.floor((parseISO(c.week) - parseISO(sundayOf(first.date))) / 864e5 / 7) + 1 : 1;
      block.weekly = [{ week: c.week, weekEnd: addDays(c.week, 6), title: 'שבוע ' + n, partial: false, note: clean(o.weekly.note), ideas: (o.weekly.ideas || []).slice(0, 5).map(x => ({ domain: dom(x.domain), title: clean(x.title), text: clean(x.text) })), quiz: o.weekly.quiz.filter(q => q && Array.isArray(q.options) && q.options.length >= 2 && Number.isInteger(q.answer)).slice(0, 8) }];
    }
    return block;
  }

  /* ---------- יצירת התדריך ---------- */
  let genBusy = false, genStageIdx = 0, genTimer = null, genExtra = false;
  let genChars = 0;
  function renderGenProgress() { const p = document.getElementById('gen-progress'); if (p) p.textContent = genChars ? 'נכתבו עד עכשיו כ-' + Math.round(genChars / 5) + ' מילים' : ''; else renderGenBanner(); }
  const GEN_STAGES = ['מחפש את החדשות של היום', 'בוחר את הנושא האקטואלי', 'כותב את נקודות הידע', (EN_ON ? 'מכין את משפטי האנגלית' : 'מוסיף ציטוטים'), 'בודק ומסדר את התדריך'];
  function canAutoGen() {
    const lg = st().lastGen;
    const failedOften = lg && lg.date === today && !lg.ok && (lg.failCount || 0) >= 3;
    return st().auto !== false && !!getKey() && !S.days[today] && new Date().getHours() >= (st().hour || 0) && !failedOften;
  }
  /* התאריך הפנוי הבא לתדריך נוסף */
  function nextFreeDate() { let t = today; while (S.days[t]) t = addDays(t, 1); return t; }
  function generateExtra() {
    if (genBusy) { toast('תדריך כבר נכתב עכשיו. המתן לסיומו.'); return; }
    if (!getKey()) { toast('כדי ליצור תדריך נוסף, הזן מפתח API בהגדרות.'); return; }
    return generateDay(nextFreeDate(), true, true);
  }
  function generateToday(manual) { return generateDay(today, manual, false); }
  async function generateDay(target, manual, extra) {
    if (genBusy) return;
    if (S.days[target]) { if (manual) toast('התדריך של היום כבר קיים.'); return; }
    if (!getKey()) { if (manual) toast('הזן קודם מפתח API.'); return; }
    try { const l = +localStorage.getItem(LOCK) || 0; if (!manual && Date.now() - l < 5 * 60 * 1000) return; localStorage.setItem(LOCK, String(Date.now())); } catch (e) { /* ignore */ }
    genBusy = true; genStageIdx = 0; genExtra = !!extra; genChars = 0;
    let wake = null; try { if (navigator.wakeLock) wake = await navigator.wakeLock.request('screen'); } catch (e) { /* לא נתמך */ }
    if (extra) { st().lastExtra = null; save(); }
    genTimer = setInterval(() => { genStageIdx = Math.min(genStageIdx + 1, GEN_STAGES.length - 1); renderGenBanner(); }, 20000);
    renderAll();
    const ctx = buildContext();
    ctx.target = target; ctx.extra = !!extra; if (extra) ctx.isFriday = false;
    try {
      const r1 = await callClaude({ system: SYS_BRIEF, messages: [{ role: 'user', content: corePrompt(ctx) }], maxTokens: 32000, search: 5, onProgress: n => { genChars = n; if (genStageIdx < 2) genStageIdx = 2; renderGenProgress(); } });
      if (r1.stop === 'max_tokens') throw { code: 'cut' };
      const core = parseJSON(textOf(r1.content));
      if (!core || !core.day || !Array.isArray(core.knowledge) || core.knowledge.length < 3) throw { code: 'parse' };
      if (core.knowledge.length < 7) {
        const base = genChars;
        const rm = await callClaude({ system: SYS_BRIEF, messages: [{ role: 'user', content: morePrompt(ctx, core) }], maxTokens: 16000, onProgress: n => { genChars = base + n; renderGenProgress(); } });
        const more = rm.stop === 'max_tokens' ? null : parseJSON(textOf(rm.content));
        if (more && Array.isArray(more.knowledge)) core.knowledge = core.knowledge.concat(more.knowledge).slice(0, 7);
        if (core.knowledge.length < 5) throw { code: rm.stop === 'max_tokens' ? 'cut' : 'parse' };
      }
      let lang = { english: [], quotes: [], weekly: null };
      if (!extra) {
        genStageIdx = Math.max(genStageIdx, 3); renderGenBanner();
        const r2 = await callClaude({ system: SYS_BRIEF, messages: [{ role: 'user', content: langPrompt(ctx, core) }], maxTokens: 16000, onProgress: n => { genChars = n; renderGenProgress(); } });
        if (r2.stop === 'max_tokens') throw { code: 'cut' };
        lang = parseJSON(textOf(r2.content));
      }
      const block = toBlock(Object.assign({}, core, lang), ctx);
      mergeContent(block, false);
      if (!extra) st().lastGen = { date: today, at: new Date().toISOString(), ok: true };
      save(); currentDate = extra ? target : pickDate(); practice = null; answerDraft = { date: null, text: '', dirty: false };
      toast(extra ? 'התדריך הנוסף מוכן' : 'התדריך של היום מוכן');
      if (extra) { st().lastExtra = { at: new Date().toISOString(), ok: true }; save(); window.scrollTo(0, 0); }
    } catch (e) {
      if (extra) { st().lastExtra = { at: new Date().toISOString(), ok: false, error: errMessage(e) }; save(); toast(errMessage(e)); return; }
      const prev = st().lastGen;
      st().lastGen = { date: today, at: new Date().toISOString(), ok: false, error: errMessage(e), failCount: (prev && prev.date === today && !prev.ok ? (prev.failCount || 1) + 1 : 1) };
      save();
    } finally {
      genBusy = false; clearInterval(genTimer);
      try { if (wake) wake.release(); } catch (e) { /* ignore */ }
      try { localStorage.removeItem(LOCK); } catch (e) { /* ignore */ }
      renderAll();
    }
  }
  function maybeAutoGen() { if (canAutoGen()) generateToday(false); }

  function renderGenBanner() {
    const b = $('#gen-banner'); b.innerHTML = ''; b.className = 'gen-banner';
    const lg = st().lastGen, lx = st().lastExtra;
    if (genBusy) {
      const h = el('h3'); h.append(el('span', 'spin'), document.createTextNode(GEN_STAGES[genStageIdx] + '…'));
      b.append(h, el('p', 'he', (genExtra ? 'התדריך הנוסף' : 'תדריך הבוקר') + ' נכתב עכשיו. זה לוקח בדרך כלל דקה עד שלוש. השאר את האפליקציה פתוחה עד הסיום.'));
      const pg = el('p', 'nextrev'); pg.id = 'gen-progress'; pg.textContent = genChars ? 'נכתבו עד עכשיו כ-' + Math.round(genChars / 5) + ' מילים' : ''; b.append(pg);
      b.hidden = false; return;
    }
    if (lx && !lx.ok && Date.now() - new Date(lx.at) < 6 * 3600e3) {
      b.classList.add('err');
      b.append(el('h3', null, 'יצירת התדריך הנוסף נכשלה'), el('p', 'he', lx.error || ''));
      const again = el('button', 'primary', 'נסה שוב'); again.type = 'button'; again.addEventListener('click', generateExtra);
      const x = el('button', 'ghost', 'סגור'); x.type = 'button'; x.addEventListener('click', () => { st().lastExtra = null; save(); renderGenBanner(); });
      const row = el('div', 'ans-row'); row.append(again, x); b.append(row);
      b.hidden = false; return;
    }
    if (S.days[today]) { b.hidden = true; return; }
    if (!getKey()) {
      b.append(el('h3', null, 'התדריך של היום עוד לא נוצר'), el('p', 'he', 'כדי שהתדריך ייווצר לבד כל בוקר, הזן פעם אחת מפתח API בהגדרות.'));
      const go = el('button', 'ghost', 'למסך ההגדרות'); go.type = 'button'; go.addEventListener('click', () => show('settings')); b.append(go);
    } else if (lg && lg.date === today && !lg.ok) {
      b.classList.add('err');
      b.append(el('h3', null, 'יצירת התדריך נכשלה'), el('p', 'he', lg.error || ''));
      const again = el('button', 'primary', 'נסה שוב'); again.type = 'button'; again.addEventListener('click', () => generateToday(true)); b.append(again);
    } else if (st().auto === false) {
      b.append(el('h3', null, 'היצירה האוטומטית כבויה'));
      const go = el('button', 'primary', 'צור את תדריך היום'); go.type = 'button'; go.addEventListener('click', () => generateToday(true)); b.append(go);
    } else if (new Date().getHours() < (st().hour || 0)) {
      b.append(el('h3', null, 'התדריך של היום ייווצר אחרי השעה ' + st().hour + ':00'));
      const go = el('button', 'ghost', 'צור עכשיו'); go.type = 'button'; go.addEventListener('click', () => generateToday(true)); b.append(go);
    } else { b.hidden = true; return; }
    b.hidden = false;
  }

  /* ---------- פירוש מילה במילה לפי דרישה (לפריטים שאין להם עדיין) ---------- */
  const SYS_GLOSS = `קבל משפט באנגלית והחזר פירוש מילולי, מילה מול מילה, לפי סדר המילים במשפט.
כל מילה בשורה נפרדת בתבנית: word=פירוש
הפירוש בעברית, מדויק בהקשר המשפט. ביטוי קבוע (כמו rather than, out of, will have to) כתוב כיחידה אחת. a/an: (סתמי). the: ה־. מילת עזר שאין לה מקבילה בעברית: הסבר קצר בסוגריים, כגון (סימן עתיד).
בלי סימני פיסוק, בלי מספור ובלי שום טקסט נוסף.`;
  async function makeGloss(it) {
    if (!it || glossBusy.has(it.id)) return;
    glossBusy.add(it.id); renderAll();
    try {
      const r = await callClaude({ system: SYS_GLOSS, messages: [{ role: 'user', content: it.en }], maxTokens: 1500 });
      const pairs = parseGloss(textOf(r.content).replace(/```/g, '').trim().replace(/\r?\n+/g, '|')).map(([a, b]) => [a.replace(/^[-•\d.\s]+/, '').replace(/[.,;:!?]+$/, ''), b]).filter(p => p[0]);
      if (pairs.length < 2) throw { code: 'parse' };
      S.items[it.id].gloss = pairs; save();
    } catch (e) { toast(errMessage(e)); }
    finally { glossBusy.delete(it.id); renderAll(); }
  }

  /* ---------- שאלות העמקה בתוך הכרטיס ---------- */
  const askBusy = new Set();
  const SYS_ASK = `אתה מורה מעמיק ומכובד באפליקציית הלמידה "דעת יומית". ענה בעברית תקנית ובוגרת, בלשון זכר כשפונים לשואל. נימה מעט תורנית ומכובדת היכן שמתאים, עם מקורות מדויקים. 3 עד 6 פסקאות קצרות, טקסט רגיל בלבד: בלי כותרות, בלי רשימות, בלי הדגשות ובלי הקדמות. בנושאים שבמחלוקת פוליטית הצג כמה צדדים בלי לנקוט עמדה. כשהתשובה תלויה במידע עדכני, חפש ברשת.`;
  async function askAbout(it, q) {
    const question = q || 'הרחב את הנושא לעומק: הרקע, המחלוקות המרכזיות, ומה ראוי שאדם חכם יידע עליו.';
    askBusy.add(it.id); renderAll();
    try {
      const msg = 'הנושא: ' + (it.title || '') + ' (' + (DOMAINS[it.domain] || '') + ')\nמה שנלמד בכרטיס: ' + String(it.content || '').slice(0, 2500) + '\n\nהשאלה: ' + question;
      const r = await callClaude({ system: SYS_ASK, messages: [{ role: 'user', content: msg }], maxTokens: 2500, search: 3 });
      const a = clean(textOf(r.content)); if (!a) throw { code: 'parse' };
      const item = S.items[it.id]; item.qa = (Array.isArray(item.qa) ? item.qa : []).concat([{ q: q || 'הרחבה כללית של הנושא', a, date: today }]);
      deepDraft[it.id] = ''; save();
    } catch (e) { toast(errMessage(e)); }
    finally { askBusy.delete(it.id); renderAll(); }
  }

  /* ---------- הגדרות התדריך האוטומטי ---------- */
  MODELS.forEach(([v, l]) => { const o = el('option', null, l); o.value = v; $('#model-select').append(o); });
  for (let h = 0; h <= 10; h++) { const o = el('option', null, h === 0 ? 'ללא הגבלה (מחצות)' : h + ':00'); o.value = String(h); $('#hour-select').append(o); }
  $('#model-select').addEventListener('change', e => { st().model = e.target.value; save(); });
  $('#hour-select').addEventListener('change', e => { st().hour = +e.target.value; save(); renderGenBanner(); });
  $('#auto-toggle').addEventListener('change', e => { st().auto = e.target.checked; save(); renderAll(); if (e.target.checked) maybeAutoGen(); });
  $('#btn-key-save').addEventListener('click', () => {
    const k = $('#api-key').value.trim();
    if (!k) { toast('הדבק קודם את המפתח.'); return; }
    if (!setKey(k)) { toast('שמירת המפתח נכשלה בדפדפן הזה.'); return; }
    $('#api-key').value = '';
    if (st().lastGen && st().lastGen.date === today && !st().lastGen.ok) st().lastGen.failCount = 0;
    save(); renderAll(); toast(/^sk-ant-/.test(k) ? 'המפתח נשמר' : 'המפתח נשמר, אך הוא אינו נראה כמו מפתח של Anthropic');
    maybeAutoGen();
  });
  $('#btn-key-del').addEventListener('click', e => {
    const b = e.currentTarget;
    if (!b.dataset.armed) { b.dataset.armed = '1'; b.textContent = 'לחץ שוב למחיקת המפתח'; return; }
    delete b.dataset.armed; b.textContent = 'מחק את המפתח מהמכשיר'; setKey(''); renderAll(); toast('המפתח נמחק מהמכשיר');
  });
  $('#btn-test').addEventListener('click', async () => {
    const s = $('#gen-status'); s.textContent = 'בודק חיבור…';
    try { await callClaude({ messages: [{ role: 'user', content: 'השב במילה אחת: תקין' }], maxTokens: 10 }); s.textContent = 'החיבור תקין. המודל זמין והמפתח פעיל.'; }
    catch (e) { s.textContent = errMessage(e); }
  });
  $('#btn-gen-now').addEventListener('click', () => { show('today'); if (S.days[today]) generateExtra(); else generateToday(true); });

  function renderAutoSettings() {
    const has = !!getKey();
    $('#key-status').textContent = has ? '✓ המפתח שמור בדפדפן הזה (מסתיים ב-' + getKey().slice(-4) + '). השדה מוצג ריק בכוונה, כדי שהמפתח לא ייחשף.' : 'לא הוזן מפתח בדפדפן הזה.';
    $('#key-status').className = has ? 'key-ok' : 'nextrev';
    $('#api-key').placeholder = has ? 'להחלפת המפתח, הדבק מפתח חדש' : 'sk-ant-...';
    $('#model-select').value = st().model;
    $('#hour-select').value = String(st().hour || 0);
    $('#auto-toggle').checked = st().auto !== false;
    $('#btn-gen-now').disabled = !has || genBusy;
    $('#btn-gen-now').textContent = S.days[today] ? 'צור תדריך נוסף עכשיו' : 'צור את תדריך היום עכשיו';
    $('#btn-test').disabled = !has;
    $('#btn-key-del').hidden = !has;
    const lg = st().lastGen;
    const lx = st().lastExtra;
    if (lx && (!$('#gen-status').textContent || /^(התדריך האחרון|ניסיון אחרון|תדריך נוסף)/.test($('#gen-status').textContent))) {
      $('#gen-status').textContent = genBusy ? '' : lx.ok ? 'תדריך נוסף נוצר בהצלחה, ' + new Date(lx.at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : 'תדריך נוסף נכשל (' + new Date(lx.at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) + '): ' + lx.error;
    } else if (!$('#gen-status').textContent || /^(התדריך האחרון|ניסיון אחרון)/.test($('#gen-status').textContent)) {
      $('#gen-status').textContent = genBusy ? '' : lg ? (lg.ok ? 'התדריך האחרון נוצר ב-' + heDate(isoLocal(new Date(lg.at))) + ', ' + new Date(lg.at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : 'ניסיון אחרון נכשל: ' + lg.error) : '';
    }
    $('#req-sec').hidden = has;
    const vm = document.querySelector('meta[name=daat-version]'); $('#app-version').textContent = 'גרסה ' + (vm ? vm.content : '?') + ' · מפתח ' + (has ? 'שמור' : 'חסר') + ' · מודל ' + (st().model || '');
  }

  /* ======================================================================
     ניווט
     ====================================================================== */
  if (!EN_ON) { const tb = document.querySelector('.tab[data-tab="english"]'); if (tb) tb.hidden = true; const vs = document.getElementById('voice-sec'); if (vs) vs.hidden = true; }
  const VIEWS = ['today', 'english', 'review', 'archive', 'progress', 'settings'];
  let tab = 'today';
  function show(name) {
    tab = name;
    VIEWS.forEach(v => { $('#view-' + v).hidden = v !== name; });
    $$('.tab').forEach(x => { if (x.dataset.tab === name) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current'); });
    $('#btn-settings').setAttribute('aria-pressed', name === 'settings');
    if (tts && !['english', 'review', 'archive'].includes(name)) { try { tts.cancel(); } catch (e) { /* ignore */ } }
    renderAll(); window.scrollTo(0, 0);
  }
  $$('.tab').forEach(b => b.addEventListener('click', () => show(b.dataset.tab)));
  $('#btn-settings').addEventListener('click', () => show(tab === 'settings' ? 'today' : 'settings'));

  function renderAll() {
    renderGenBanner(); renderTopic(); renderCards(); renderExtras(); renderAsk();
    renderEnglish(); renderReview(); renderArchive(); renderProgress(); renderSettings();
    updateBadge();
  }

  /* סנכרון בין לשוניות פתוחות של אותו דפדפן */
  window.addEventListener('storage', e => { if (e.key === KEY && !genBusy) { S = load(); currentDate = pickDate(); renderAll(); } });

  /* חזרה לאפליקציה (למשל למחרת בבוקר): מעדכן את התאריך ויוצר תדריך אם צריך */
  function onWake() {
    const now = isoLocal(new Date());
    if (now !== today) { today = now; currentDate = pickDate(); answerDraft = { date: null, text: '', dirty: false }; rsess = null; practice = null; renderAll(); }
    maybeAutoGen();
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') onWake(); });
  window.addEventListener('focus', onWake);

  /* ======================================================================
     שמי כוכבים חיים בלוח הפתיחה
     ====================================================================== */
  (function sky() {
    const cv = $('#sky'), hero = $('#hero'); if (!cv || !cv.getContext) return;
    const ctx = cv.getContext('2d');
    const still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, stars = [], links = [], raf = 0, last = 0;
    function seed() {
      const r = hero.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(140, W * H / 2600));
      let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
      stars = Array.from({ length: n }, () => ({ x: rnd() * W, y: rnd() * H, r: rnd() < .1 ? 1.5 + rnd() : .4 + rnd() * .9, p: rnd() * 6.28, v: .4 + rnd() * 1.2, g: rnd() < .22 }));
      links = [];
      const big = stars.filter(x => x.r > 1.2).slice(0, 9);
      big.forEach((a, i) => { const b = big[i + 1]; if (b && Math.hypot(a.x - b.x, a.y - b.y) < W * .35) links.push([a, b]); });
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      const cs = getComputedStyle(hero), cStar = cs.getPropertyValue('--star').trim() || '#EAF0FA', cGold = cs.getPropertyValue('--star-gold').trim() || '#F3D893';
      ctx.lineWidth = .6; ctx.strokeStyle = cs.getPropertyValue('--star-link').trim() || 'rgba(226,191,115,.18)';
      links.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
      stars.forEach(st => {
        const tw = still ? .8 : .55 + .45 * Math.sin(st.p + t / 1000 * st.v);
        ctx.globalAlpha = tw;
        ctx.fillStyle = st.g ? cGold : cStar;
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 6.283); ctx.fill();
        if (st.r > 1.4) { ctx.globalAlpha = tw * .25; ctx.beginPath(); ctx.arc(st.x, st.y, st.r * 3.2, 0, 6.283); ctx.fill(); }
      });
      ctx.globalAlpha = 1;
    }
    function loop(t) { raf = requestAnimationFrame(loop); if (t - last < 50) return; last = t; draw(t); }
    function start() { cancelAnimationFrame(raf); seed(); if (still) draw(0); else raf = requestAnimationFrame(loop); }
    try { new ResizeObserver(() => { seed(); if (still) draw(0); }).observe(hero); } catch (e) { window.addEventListener('resize', start); }
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else if (!still) raf = requestAnimationFrame(loop); });
    start();
  })();

  applyTheme();
  renderAll();
  maybeAutoGen();
})();

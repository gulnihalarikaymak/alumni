// Interface language: English (the default) or Turkish. Used by every page.
//
// The English text itself is the key: t('Users') returns 'Kullanıcılar' in
// Turkish and 'Users' in English. A text without a Turkish entry stays English.
// Only interface text is translated. Records from the database and the API's
// error messages stay as they are.
//
// Static HTML is translated once by translatePage(), called at the end of each
// page's <body>. JavaScript that builds a page calls t() for its own text.
// The choice is saved in localStorage ("lang"), like the theme ("theme").
(() => {
  const tr = {
    // Header, menu and footer (landing and workspace)
    'Skip to content': 'İçeriğe geç',
    'Alumni Network': 'Mezun Ağı',
    'ATS İÜ Alumni Network, home': 'ATS İÜ Mezun Ağı, ana sayfa',
    'Main navigation': 'Ana menü',
    'Platform': 'Platform',
    'Home': 'Ana sayfa',
    'Workspace': 'Çalışma alanı',
    'Opportunities': 'Fırsatlar',
    'Announcements': 'Duyurular',
    'Applications': 'Başvurular',
    'Users': 'Kullanıcılar',
    'About': 'Hakkında',
    'Register': 'Kayıt ol',
    'Menu': 'Menü',
    'Open navigation': 'Menüyü aç',
    'Close navigation': 'Menüyü kapat',
    'Switch theme': 'Temayı değiştir',
    'Switch to dark theme': 'Koyu temaya geç',
    'Switch to light theme': 'Açık temaya geç',
    'Additional resources': 'Ek kaynaklar',
    'API docs': 'API belgeleri',
    'System status': 'Sistem durumu',
    'Back to top': 'Başa dön',
    'Loading workspace…': 'Çalışma alanı yükleniyor…',

    // Landing: hero and gallery
    'Beyond the Years — ATS İÜ Alumni Network': 'Yılların Ötesinde — ATS İÜ Mezun Ağı',
    'Three friends walking together under sunlit campus trees': 'Güneşli kampüs ağaçlarının altında birlikte yürüyen üç arkadaş',
    'İstanbul Üniversitesi · Alumni Network': 'İstanbul Üniversitesi · Mezun Ağı',
    'The story doesn’t end here.': 'Hikâye burada bitmiyor.',
    'The story|doesn’t end here.': 'Hikâye|burada bitmiyor.',
    'From the moments that shaped us to the futures we build, our connections continue beyond graduation.':
      'Bizi biz yapan anlardan kurduğumuz geleceklere, bağlarımız mezuniyetin ötesinde sürüyor.',
    'Explore the Alumni Network': 'Mezun Ağını Keşfet',
    'Enter ATS Platform': 'ATS Platformuna Gir',
    'Scroll': 'Kaydır',
    'to explore': 've keşfet',
    'Campus photo gallery': 'Kampüs fotoğraf galerisi',
    'Previous photograph': 'Önceki fotoğraf',
    'Next photograph': 'Sonraki fotoğraf',
    'The Beginning': 'Başlangıç',
    'The Milestone': 'Dönüm Noktası',
    'The Journey Forward': 'İleriye Yolculuk',
    'The Connection': 'Bağ',
    'Two designers working on a model in an architecture studio': 'Mimarlık atölyesinde maket üzerinde çalışan iki tasarımcı',

    // Landing: the four chapters
    'The alumni journey': 'Mezun yolculuğu',
    'Beyond the': 'Yılların',
    'years.': 'ötesinde.',
    'Previous chapter': 'Önceki bölüm',
    'Next chapter': 'Sonraki bölüm',
    'Next chapter, The Milestone': 'Sonraki bölüm, Dönüm Noktası',
    'Jump to a chapter': 'Bir bölüme git',
    'Chapter 01': 'Bölüm 01',
    'Chapter 02': 'Bölüm 02',
    'Chapter 03': 'Bölüm 03',
    'Chapter 04': 'Bölüm 04',
    'Students walking through a sunlit stone arcade': 'Güneşli taş revakta yürüyen öğrenciler',
    'Graduates tossing their caps into the air': 'Keplerini havaya atan mezunlar',
    'Two designers leaning over an architectural model in a studio': 'Atölyede mimari maketin üzerine eğilmiş iki tasarımcı',
    'Friends talking over tea around an outdoor table': 'Açık havada bir masa etrafında çay içip sohbet eden arkadaşlar',
    'Every story begins': 'Her hikâye bir yerde',
    'somewhere.': 'başlar.',
    'For us, it began with shared classrooms, familiar corridors, and the experiences that shaped who we became.':
      'Bizim için ortak sınıflarla, tanıdık koridorlarla ve bizi biz yapan deneyimlerle başladı.',
    'Some moments change': 'Bazı anlar',
    'everything.': 'her şeyi değiştirir.',
    'Graduation marks an achievement, but it also opens the door to everything that comes next.':
      'Mezuniyet bir başarıdır, ama aynı zamanda sonrasında gelecek her şeye kapı açar.',
    'A thousand paths.': 'Binlerce yol.',
    'Infinite possibilities.': 'Sonsuz olasılık.',
    'Different careers, different cities, different ambitions — connected by a shared beginning.':
      'Farklı kariyerler, farklı şehirler, farklı hayaller — ortak bir başlangıçla birbirine bağlı.',
    'Different journeys.': 'Farklı yolculuklar.',
    'One lasting connection.': 'Kalıcı tek bir bağ.',
    'Wherever life takes us, the community we built remains part of who we are.':
      'Hayat bizi nereye götürürse götürsün, kurduğumuz topluluk kim olduğumuzun bir parçası olarak kalır.',

    // Landing: community, platform and final call to action
    'Our community': 'Topluluğumuz',
    'Behind every achievement,': 'Her başarının ardında',
    'there’s a story.': 'bir hikâye var.',
    'Every graduate carries a unique journey. Together, those journeys form a community that continues to inspire, connect, and create opportunities.':
      'Her mezun kendine özgü bir yolculuk taşır. Bu yolculuklar birlikte ilham veren, bağ kuran ve fırsat yaratan bir topluluk oluşturur.',
    'Explore alumni profiles': 'Mezun profillerini keşfet',
    'A woman in an indigo work shirt leaning on a sunlit studio worktable': 'Güneşli bir atölye masasına yaslanmış, çivit mavisi iş gömlekli bir kadın',
    'A sense of belonging': 'Aidiyet duygusu',
    'A glimpse of working life after graduation': 'Mezuniyet sonrası iş hayatından bir an',
    'Finding a path': 'Yolunu bulmak',
    'Friends spending time together': 'Birlikte vakit geçiren arkadaşlar',
    'Staying connected': 'Bağlı kalmak',
    'A community that moves forward': 'İleriye giden bir topluluk',
    'Stay connected to': 'Bundan sonrasına',
    'what comes next.': 'bağlı kalın.',
    'ATS İÜ connects İstanbul University graduates through professional opportunities, university announcements, and a shared digital community.':
      'ATS İÜ, İstanbul Üniversitesi mezunlarını kariyer fırsatları, üniversite duyuruları ve ortak bir dijital toplulukla buluşturur.',
    'Alumni profiles': 'Mezun profilleri',
    'Find the people at the heart of the university community.': 'Üniversite topluluğunun kalbindeki insanları bulun.',
    'Career opportunities': 'Kariyer fırsatları',
    'Explore open positions and take the next step in your career.': 'Açık pozisyonları inceleyin ve kariyerinizde bir sonraki adımı atın.',
    'University announcements': 'Üniversite duyuruları',
    'Keep up with news and updates from the university.': 'Üniversiteden haberleri ve güncellemeleri takip edin.',
    'Follow job applications and keep track of their status.': 'İş başvurularını ve durumlarını takip edin.',
    'Your next chapter': 'Sıradaki bölümünüz',
    'Once a student.': 'Bir kez öğrenci,',
    'Always connected.': 'her zaman bağlı.',
    'Your İstanbul University journey continues through the people, opportunities, and stories that connect us.':
      'İstanbul Üniversitesi yolculuğunuz bizi birbirimize bağlayan insanlar, fırsatlar ve hikâyelerle sürüyor.',
    'Enter Alumni Tracking System': 'Mezun Takip Sistemine Gir',
    'Explore Opportunities': 'Fırsatları Keşfet',
    'Create an account': 'Hesap oluştur',

    // Workspace home and about pages
    'Alumni Tracking System': 'Mezun Takip Sistemi',
    'The alumni': 'Mezun',
    'workspace.': 'çalışma alanı.',
    'Read university news, explore career opportunities and manage the records that keep the community connected.':
      'Üniversite haberlerini okuyun, kariyer fırsatlarını keşfedin ve topluluğu bir arada tutan kayıtları yönetin.',
    'Browse opportunities': 'Fırsatlara göz at',
    'Students spending time together on campus': 'Kampüste birlikte vakit geçiren öğrenciler',
    'Workspace sections': 'Çalışma alanı bölümleri',
    'Read and publish news for the alumni community.': 'Mezun topluluğu için haberleri okuyun ve yayımlayın.',
    'Browse openings and share a position.': 'Açık pozisyonlara göz atın ve ilan paylaşın.',
    'Review applications and follow their status.': 'Başvuruları inceleyin ve durumlarını takip edin.',
    'Manage user records, roles and account status.': 'Kullanıcı kayıtlarını, rolleri ve hesap durumlarını yönetin.',
    'Developer resources': 'Geliştirici kaynakları',
    'API documentation': 'API belgeleri',
    'Service health': 'Servis durumu',
    'Hello': 'Merhaba',
    'Named greeting': 'İsimle selamlama',
    'Sum': 'Toplama',
    'About ATS İÜ': 'ATS İÜ hakkında',
    'A shared': 'Ortak bir',
    'beginning.': 'başlangıç.',
    'The Alumni Tracking System connects İstanbul University’s graduates with university announcements, job postings and the people who share their history.':
      'Mezun Takip Sistemi, İstanbul Üniversitesi mezunlarını üniversite duyuruları, iş ilanları ve aynı geçmişi paylaştıkları insanlarla buluşturur.',
    'Enter the workspace': 'Çalışma alanına gir',
    'People spending time together outdoors': 'Açık havada birlikte vakit geçiren insanlar',

    // Workspace: shared controls and messages
    'Try again': 'Tekrar dene',
    'Loading…': 'Yükleniyor…',
    'Unable to load page': 'Sayfa yüklenemedi',
    'The service could not be reached. Check your connection and try again.': 'Servise ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.',
    'The request could not be completed. Please try again.': 'İstek tamamlanamadı. Lütfen tekrar deneyin.',
    'Choose…': 'Seçin…',
    'Cancel': 'İptal',
    'Delete': 'Sil',
    'Edit': 'Düzenle',
    'Open': 'Aç',
    'Save': 'Kaydet',
    'Save changes': 'Değişiklikleri kaydet',
    'Create': 'Oluştur',
    'Publish': 'Yayımla',
    'View JSON': 'JSON verisini gör',
    'Details': 'Ayrıntılar',
    'newest first': 'en yeni önce',
    'ID': 'No',
    'E-mail': 'E-posta',
    'Role': 'Rol',
    'Status': 'Durum',
    'Created': 'Oluşturuldu',
    'Actions': 'İşlemler',
    'Updated': 'Güncellendi',
    'Edited': 'Düzenlendi',

    // Users, announcements and job postings
    'user': 'kullanıcı',
    'users': 'kullanıcı',
    'announcement': 'duyuru',
    'announcements': 'duyuru',
    'job posting': 'iş ilanı',
    'job postings': 'iş ilanı',
    'application': 'başvuru',
    'applications': 'başvuru',
    'Job postings': 'İş ilanları',
    'New user': 'Yeni kullanıcı',
    'New announcement': 'Yeni duyuru',
    'New job posting': 'Yeni iş ilanı',
    'Edit user #{id}': 'Kullanıcıyı düzenle #{id}',
    'Edit announcement #{id}': 'Duyuruyu düzenle #{id}',
    'Edit job posting #{id}': 'İş ilanını düzenle #{id}',
    'Back to the user': 'Kullanıcıya dön',
    'Back to the announcement': 'Duyuruya dön',
    'Back to the job posting': 'İş ilanına dön',
    'All users': 'Tüm kullanıcılar',
    'All announcements': 'Tüm duyurular',
    'All job postings': 'Tüm iş ilanları',
    'No users yet.': 'Henüz kullanıcı yok.',
    'No announcements yet.': 'Henüz duyuru yok.',
    'No job postings yet.': 'Henüz iş ilanı yok.',
    'User records': 'Kullanıcı kayıtları',
    'User #{id}': 'Kullanıcı #{id}',
    'Delete this announcement?': 'Bu duyuru silinsin mi?',
    'Delete this user and their applications?': 'Bu kullanıcı ve başvuruları silinsin mi?',
    'Delete this job posting and its applications?': 'Bu iş ilanı ve başvuruları silinsin mi?',
    'Apply by': 'Son başvuru',
    'Open until removed': 'Kaldırılana kadar açık',
    'Title': 'Başlık',
    'Company': 'Şirket',
    'City (optional)': 'Şehir (isteğe bağlı)',
    'Work type': 'Çalışma şekli',
    'Employment type': 'İstihdam türü',
    'Employment': 'İstihdam',
    'Description': 'Açıklama',
    'Description (optional)': 'Açıklama (isteğe bağlı)',
    'Apply link (optional)': 'Başvuru bağlantısı (isteğe bağlı)',
    'Deadline (optional)': 'Son başvuru tarihi (isteğe bağlı)',
    'Deadline': 'Son başvuru',
    'Leave the deadline empty to keep the posting open until it is removed.':
      'İlanın kaldırılana kadar açık kalması için son başvuru tarihini boş bırakın.',
    'Content': 'İçerik',
    'Use up to 120 characters for the title and 2,000 for the content.': 'Başlık için en fazla 120, içerik için en fazla 2.000 karakter kullanın.',
    'New users start with pending status.': 'Yeni kullanıcılar PENDING (onay bekliyor) durumuyla başlar.',
    'Change status': 'Durumu değiştir',
    'Save status': 'Durumu kaydet',
    'Apply in ATS': 'ATS üzerinden başvur',
    'No description': 'Açıklama yok',
    'City': 'Şehir',
    'Not stated': 'Belirtilmemiş',
    'Apply': 'Başvur',
    'Posted': 'Yayımlandı',

    // Job applications
    'Job applications': 'İş başvuruları',
    'No applications yet.': 'Henüz başvuru yok.',
    'Browse job postings': 'İş ilanlarına göz at',
    'Applicant': 'Başvuran',
    'Job posting': 'İş ilanı',
    'Applied': 'Başvuru tarihi',
    'Posting #{id}': 'İlan #{id}',
    'Withdraw': 'Geri çek',
    'Withdraw this application?': 'Bu başvuru geri çekilsin mi?',
    'To apply, open a job posting.': 'Başvurmak için bir iş ilanı açın.',
    'Cover letter': 'Ön yazı',
    'Cover letter (optional)': 'Ön yazı (isteğe bağlı)',
    'Submit application': 'Başvuruyu gönder',
    'Alumni and students can apply.': 'Mezunlar ve öğrenciler başvurabilir.',
    'Add a user to get started.': 'Başlamak için bir kullanıcı ekleyin.',
    '{title} at {company}': '{company} · {title}',
    'All applications to this posting': 'Bu ilana yapılan tüm başvurular',
    'Application #{id} to': 'Başvuru #{id} ·',
    'None': 'Yok',
    'Update': 'Güncelle',

    // System status page
    'Unavailable': 'Erişilemiyor',
    'Service': 'Servis',
    'Version': 'Sürüm',
    'Uptime': 'Çalışma süresi',
    'Environment': 'Ortam',
    'JSON response': 'JSON yanıtı',
    'Raw JSON': 'Ham JSON',
    'Last response': 'Son yanıt',

    // Register page
    'Join ATS İÜ': 'ATS İÜ’ye katılın',
    'Join the alumni': 'Mezun',
    'network.': 'ağına katılın.',
    'Students, graduates and staff of İstanbul University share announcements, career opportunities and the people behind them.':
      'İstanbul Üniversitesi’nin öğrencileri, mezunları ve personeli duyuruları, kariyer fırsatlarını ve bunların arkasındaki insanları paylaşır.',
    'Graduates in gowns throwing their caps into the air': 'Cüppeleriyle keplerini havaya atan mezunlar',
    'Create your account': 'Hesabınızı oluşturun',
    'I am joining as': 'Katılım türüm',
    'Student': 'Öğrenci',
    'Graduate': 'Mezun',
    'Staff': 'Personel',
    'I am studying at İstanbul University.': 'İstanbul Üniversitesi’nde okuyorum.',
    'I completed a degree at İstanbul University.': 'İstanbul Üniversitesi’nden mezun oldum.',
    'I work at the university, for example at the career centre.': 'Üniversitede çalışıyorum, örneğin kariyer merkezinde.',
    'Your account is created with this address.': 'Hesabınız bu adresle oluşturulur.',
    'Graduate details': 'Mezun bilgileri',
    'Full name': 'Ad soyad',
    'Graduation year': 'Mezuniyet yılı',
    'From {first} to {last}.': '{first} ile {last} arası.',
    'City only, no street address.': 'Sadece şehir; açık adres yazmayın.',
    'I accept the privacy notice: ATS stores my e-mail and role and, for graduates, my name, graduation year and city. No ID number, birth date or home address is collected.':
      'Aydınlatma metnini kabul ediyorum: ATS e-posta adresimi ve rolümü, mezunlar için ayrıca adımı, mezuniyet yılımı ve şehrimi saklar. Kimlik numarası, doğum tarihi veya ev adresi istenmez.',
    'Create account': 'Hesap oluştur',
    'Use another e-mail address.': 'Başka bir e-posta adresi kullanın.',
    'Welcome to the network': 'Ağa hoş geldiniz',
    'Your account is saved and waiting for approval by an ATS administrator. You can log in once it is approved.':
      'Hesabınız kaydedildi ve bir ATS yöneticisinin onayını bekliyor. Onaylandıktan sonra giriş yapabilirsiniz.',
    'Password': 'Şifre',
    'At least 8 characters.': 'En az 8 karakter.',
    'Repeat password': 'Şifre (tekrar)',
    'The passwords do not match.': 'Şifreler aynı değil.',
    'Already registered?': 'Zaten kayıtlı mısınız?',

    // Login and logout
    'Log in': 'Giriş yap',
    'Log out': 'Çıkış yap',
    'Logged in as {email}': '{email} olarak giriş yapıldı',
    'Welcome back': 'Tekrar hoş geldiniz',
    'Log in to the': 'Mezun ağına',
    'alumni network.': 'giriş yapın.',
    'Use the e-mail and password you registered with. Only approved (ACTIVE) accounts can log in.':
      'Kayıt olurken kullandığınız e-posta ve şifreyle giriş yapın. Yalnızca onaylanmış (ACTIVE) hesaplar giriş yapabilir.',
    'Log in to your account': 'Hesabınıza giriş yapın',
    'No account yet?': 'Henüz hesabınız yok mu?',
    'E-mail or password is incorrect.': 'E-posta veya şifre hatalı.',
    'You are logged in': 'Giriş yaptınız',
    'Log in to open this page.': 'Bu sayfayı açmak için giriş yapın.',

    // Admin panel
    'Admin': 'Yönetim',
    '{count} waiting for approval': '{count} hesap onay bekliyor',
    'Admin panel': 'Yönetim paneli',
    'Approve accounts, assign roles and manage the records.': 'Hesapları onaylayın, rol atayın ve kayıtları yönetin.',
    'Waiting for approval': 'Onay bekleyenler',
    'No accounts are waiting for approval.': 'Onay bekleyen hesap yok.',
    'Approve': 'Onayla',
    'Reject': 'Reddet',
    'You': 'Siz',
    'Role for {email}': '{email} için rol',
    'Status for {email}': '{email} için durum',
    'Delete {email} and their applications?': '{email} ve başvuruları silinsin mi?',
    'Manage content': 'İçerik yönetimi',
    'Manage announcements': 'Duyuruları yönet',
    'Manage job postings': 'İş ilanlarını yönet',
    'Review applications': 'Başvuruları incele',
    'Only admins can open this page': 'Bu sayfayı yalnızca yöneticiler açabilir',
    'Your account is {role}. Ask an admin to give you the ADMIN role.': 'Hesabınızın rolü {role}. ADMIN rolü için bir yöneticiye başvurun.',
    'Joining as': 'Katılım türü',
    'Account': 'Hesap',
    'Name': 'Ad',
    'Graduated': 'Mezuniyet',

    // My account (task 7)
    'My account': 'Hesabım',
    'Member since': 'Üyelik tarihi',
    'Alumni profile': 'Mezun profili',
    'My applications': 'Başvurularım',
    'Shortcuts': 'Kısa yollar',
    'Open the admin panel': 'Yönetim panelini aç',

    // Error pages
    'Page not found — ATS İÜ': 'Sayfa bulunamadı — ATS İÜ',
    'Page not found': 'Sayfa bulunamadı',
    'The page you requested could not be found.': 'İstediğiniz sayfa bulunamadı.',
    'No page was found at {path}.': '{path} adresinde bir sayfa bulunamadı.',
    'Back to the home page': 'Ana sayfaya dön',
    'Open workspace': 'Çalışma alanını aç',
    'Something went wrong — ATS İÜ': 'Bir sorun oluştu — ATS İÜ',
    'Service error': 'Servis hatası',
    'Something went wrong': 'Bir sorun oluştu',
    'Something went wrong on our side. Please try again later.': 'Bizim tarafımızda bir sorun oluştu. Lütfen daha sonra tekrar deneyin.'
  };

  let lang = 'en';
  try {
    const saved = localStorage.getItem('lang');
    lang = saved === 'tr' || saved === 'en' ? saved : (navigator.language || '').toLowerCase().startsWith('tr') ? 'tr' : 'en';
  } catch {}
  document.documentElement.lang = lang;

  // t('User #{id}', { id: 5 }) → 'Kullanıcı #5' in Turkish, 'User #5' in English
  function t(text, values = {}) {
    const result = (lang === 'tr' && tr[text]) || text;
    return result.replace(/\{(\w+)\}/g, (match, name) => (name in values ? values[name] : match));
  }

  // "3 users" in English, "3 kullanıcı" in Turkish (no plural after a number)
  function count(n, one, many) {
    return n + ' ' + t(n === 1 ? one : many);
  }

  // Translates the text and the labels (aria-label, alt, title, placeholder) inside root.
  function translate(root) {
    if (lang === 'en') return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.nodeValue.trim();
      if (tr[text]) node.nodeValue = node.nodeValue.replace(text, tr[text]);
    }
    for (const element of root.querySelectorAll('[aria-label], [alt], [title], [placeholder]')) {
      for (const name of ['aria-label', 'alt', 'title', 'placeholder']) {
        const value = element.getAttribute(name);
        if (value && tr[value]) element.setAttribute(name, tr[value]);
      }
    }
  }

  // The landing headline animates word by word, so its words are rebuilt
  // for the chosen language: "Hikâye | burada bitmiyor." (the last word in italics).
  function translateHeadline() {
    const headline = document.querySelector('[data-headline]');
    if (!headline || lang === 'en') return;
    const lines = t(headline.dataset.headline).split('|');
    headline.replaceChildren(...lines.map((line, lineIndex) => {
      const lineNode = document.createElement('span');
      lineNode.className = 'headline-line';
      lineNode.setAttribute('aria-hidden', 'true');
      const words = line.split(' ');
      words.forEach((word, wordIndex) => {
        const clip = document.createElement('span');
        clip.className = 'clip';
        const last = lineIndex === lines.length - 1 && wordIndex === words.length - 1;
        const inner = document.createElement(last ? 'em' : 'span');
        inner.textContent = word;
        clip.append(inner);
        lineNode.append(clip, wordIndex < words.length - 1 ? ' ' : '');
      });
      return lineNode;
    }));
  }

  // Every .lang-toggle button switches to the other language and reloads the page.
  function setUpButtons() {
    const other = lang === 'tr' ? 'en' : 'tr';
    for (const button of document.querySelectorAll('.lang-toggle')) {
      button.textContent = button.dataset.style === 'full' ? (other === 'tr' ? 'Türkçe' : 'English') : other.toUpperCase();
      button.lang = other;
      button.setAttribute('aria-label', other === 'tr' ? 'Türkçe' : 'English');
      button.title = other === 'tr' ? 'Türkçe' : 'English';
      button.hidden = false;
      button.addEventListener('click', () => {
        try { localStorage.setItem('lang', other); } catch {}
        location.reload();
      });
    }
  }

  function translatePage() {
    document.title = t(document.title);
    translateHeadline();
    translate(document.body);
    setUpButtons();
  }

  window.i18n = {
    lang,
    locale: lang === 'tr' ? 'tr-TR' : 'en-GB',
    t,
    count,
    translate,
    translatePage
  };
})();

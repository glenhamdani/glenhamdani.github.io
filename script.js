//fetch profile from randomuser
const API = 'https://randomuser.me/api/?nat=us,gb,ca,au&inc=name,location,email,phone,picture,dob,login,registered&noinfo';

const $ = id => document.getElementById(id);

async function fetchProfile() {
  try {
    setLoading(true);
    const res = await fetch(API, {cache: "no-store"});
    if(!res.ok) throw new Error('Network response not ok');
    const data = await res.json();
    const user = data.results[0];
    populate(user);
    // set raw json link
    $('openProfile').href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
  } catch (err) {
    console.error(err);
    alert('Gagal memuat data. Coba klik "New Profile" lagi.');
  } finally {
    setLoading(false);
  }
}

function populate(u){
  const fullName = [u.name.title, u.name.first, u.name.last].filter(Boolean).join(' ');
  $('name').textContent = fullName;
  $('username').textContent = '@' + (u.login.username || 'user');
  $('email').textContent = u.email || '—';
  $('phone').textContent = u.phone || '—';
  $('location').textContent = [u.location.city, u.location.state, u.location.country].filter(Boolean).join(', ');
  $('age').textContent = u.dob && u.dob.age ? u.dob.age : '—';
  $('uuid').textContent = u.login && u.login.uuid ? u.login.uuid : '—';
  const avatar = $('avatar');
  avatar.src = u.picture.large;
  avatar.alt = fullName + ' avatar';
  // download avatar
  $('downloadAvatar').href = u.picture.large;
  // small bio
  $('bio').textContent = `Registered on ${new Date(u.registered.date).toLocaleDateString()} — this profile is fetched live from randomuser.me. Click "New Profile" to load another.`;
}

// loading state
function setLoading(flag){
  const btn = $('refreshBtn');
  if(flag){ btn.textContent = 'Loading...'; btn.disabled = true; }
  else { btn.textContent = 'New Profile'; btn.disabled = false; }
}

document.getElementById('refreshBtn').addEventListener('click', fetchProfile);

// initial load
fetchProfile();

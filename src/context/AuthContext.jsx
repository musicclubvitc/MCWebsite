import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

const DEFAULT_MEMBER = {
  id: "USR-VITC-2024",
  name: "Michael Dias",
  email: "michael.dias2024@vitstudent.ac.in",
  regNumber: "24BCE5259",
  role: "Creative Head / Guitarist",
  instrument: "Lead Guitar & Production",
  yearOfStudy: "2nd Year B.Tech",
  joinedYear: "2024",
  secretKey: "6911a3522c9c7646f3f5911e",
  verified: true
};

const INITIAL_USER_BANDS = [
  {
    id: "user-band-1",
    name: "Six Delusions",
    genre: "Hard Rock & Funk",
    leader: "Rheminth Simeon",
    memberCount: 7,
    memberNames: [
      "Aarav Sharma",
      "Rheminth Simeon",
      "Anshul",
      "Jerald Elias",
      "Surya",
      "Aurum",
      "Mihir"
    ],
    registerNumbers: [
      "22BCE1289",
      "21BCE1402",
      "21BCE2891",
      "22BEE0412",
      "21BME0911",
      "22BCI0144",
      "21BCE1980"
    ],
    status: "Approved",
    createdAt: "2024-08-15"
  },
  {
    id: "user-band-2",
    name: "Velvet Groove",
    genre: "Indie Pop & R&B",
    leader: "Aarav Sharma",
    memberCount: 4,
    memberNames: [
      "Aarav Sharma",
      "Tara Menon",
      "David John",
      "Siddharth P"
    ],
    registerNumbers: [
      "22BCE1289",
      "22BCE0314",
      "21BCE2210",
      "22BME0344"
    ],
    status: "Approved",
    createdAt: "2024-11-02"
  }
];

const INITIAL_BOOKINGS = [
  {
    id: "BKG-1049",
    date: "2026-10-31",
    day: "Saturday",
    timeSlot: "10:45 AM - 12:35 PM",
    bookingMode: "Block",
    bookerName: "Michael Dias",
    bookerReg: "24BCE5259",
    blockReason: "Event setup",
    status: "Blocked",
    createdAt: "2026-10-29"
  },
  {
    id: "BKG-1048",
    date: "2026-10-27",
    day: "Tuesday",
    timeSlot: "04:15 PM - 05:10 PM",
    bookingMode: "Self",
    bookerName: "Aarav Sharma",
    bookerReg: "22BCE1289",
    status: "Approved",
    createdAt: "2026-10-25"
  },
  {
    id: "BKG-1044",
    date: "2026-10-11",
    day: "Sunday",
    timeSlot: "01:30 PM - 07:00 PM",
    bookingMode: "Bands",
    bandName: "Six Delusions",
    bookerName: "Aarav Sharma",
    bookerReg: "22BCE1289",
    status: "Blocked",
    createdAt: "2026-10-08"
  },
  {
    id: "BKG-1043",
    date: "2026-10-11",
    day: "Sunday",
    timeSlot: "10:45 AM - 12:35 PM",
    bookingMode: "Self",
    bookerName: "Aarav Sharma",
    bookerReg: "22BCE1289",
    status: "Blocked",
    createdAt: "2026-10-08"
  },
  {
    id: "BKG-1038",
    date: "2026-08-26",
    day: "Wednesday",
    timeSlot: "09:50 AM - 11:40 AM",
    bookingMode: "Bands",
    bandName: "Six Delusions",
    bookerName: "Aarav Sharma",
    bookerReg: "22BCE1289",
    status: "Approved",
    createdAt: "2026-08-20"
  },
  {
    id: "BKG-1031",
    date: "2026-07-19",
    day: "Sunday",
    timeSlot: "03:20 PM - 06:05 PM",
    bookingMode: "Self",
    bookerName: "Aarav Sharma",
    bookerReg: "22BCE1289",
    status: "Approved",
    createdAt: "2026-07-15"
  }
];

const INITIAL_INSTRUMENT_REQUESTS = [
  {
    id: "REQ-8021",
    instrumentName: "Fender Player Stratocaster (HSS)",
    instrumentCode: "GTR-FEN-01",
    borrowDate: "2026-11-10",
    borrowTime: "17:30",
    returnDate: "2026-11-11",
    returnTime: "10:00",
    purpose: "College Cultural Fest Band Showcase",
    status: "Approved",
    requester: "Aarav Sharma",
    regNumber: "22BCE1289",
    createdAt: "2026-11-01"
  },
  {
    id: "REQ-8022",
    instrumentName: "Roland XPS-30 Synthesizer",
    instrumentCode: "KEY-ROL-01",
    borrowDate: "2026-11-12",
    borrowTime: "15:00",
    returnDate: "2026-11-13",
    returnTime: "18:00",
    purpose: "Live Track Sequencing & Stage Audition",
    status: "Pending",
    requester: "Aarav Sharma",
    regNumber: "22BCE1289",
    createdAt: "2026-11-04"
  },
  {
    id: "REQ-7994",
    instrumentName: "Shure SM58 Dynamic Vocal Microphones (Set of 3)",
    instrumentCode: "MIC-SHU-03",
    borrowDate: "2026-10-25",
    borrowTime: "14:00",
    returnDate: "2026-10-26",
    returnTime: "12:00",
    purpose: "Acoustic Unplugged Evening Rehearsal",
    status: "Returned",
    requester: "Michael Dias",
    regNumber: "24BCE5259",
    createdAt: "2026-10-20"
  }
];

const INITIAL_ADMIN_USERS = [
  { id: 'usr-1', name: 'Sarvesh C', email: 'sarvesh.c2024@vitstudent.ac.in', regNumber: '24BCE5259', role: 'Developer', type: 'Admin', verified: 'Verified', secretKey: '68ff9228ab0faf069397bb24' },
  { id: 'usr-2', name: 'Michael Dias', email: 'michael.dias2024@vitstudent.ac.in', regNumber: '24BCE5260', role: 'Creative Head', type: 'Admin', verified: 'Verified', secretKey: '6911a3522c9c7646f3f5911e' },
  { id: 'usr-3', name: 'Aarav Sharma', email: 'aarav.sharma2022@vitstudent.ac.in', regNumber: '22BCE1289', role: 'Guitarist', type: 'User', verified: 'Verified', secretKey: '68ff920169754d9fb129e4a2' },
  { id: 'usr-4', name: 'Dhivi Bommisetty', email: 'dhivi.b2024@vitstudent.ac.in', regNumber: '26BHC1062', role: 'Vocalist', type: 'User', verified: 'Unverified', secretKey: '68ff925280e2ebc5981e2330' },
  { id: 'usr-5', name: 'Aravindakshan C J', email: 'aravind.cj2024@vitstudent.ac.in', regNumber: '26MIS1138', role: 'Drummer', type: 'User', verified: 'Unverified', secretKey: '6900e3ff6657a7fe8361a944' },
  { id: 'usr-6', name: 'Shruthika P', email: 'shruthika.p2024@vitstudent.ac.in', regNumber: '26BBH1010', role: 'Keyboardist', type: 'User', verified: 'Verified', secretKey: '68ff92123456789abcdef012' },
  { id: 'usr-7', name: 'Ajay', email: 'ajay2025@vitstudent.ac.in', regNumber: '25BMV1028', role: 'Bassist', type: 'User', verified: 'Unverified', secretKey: '68ff92987654321fedcba345' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("vitc_music_user");
    return saved ? JSON.parse(saved) : DEFAULT_MEMBER;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem("vitc_music_is_admin");
    return saved ? JSON.parse(saved) : true;
  });

  const [bands, setBands] = useState(() => {
    const saved = localStorage.getItem("vitc_music_bands");
    return saved ? JSON.parse(saved) : INITIAL_USER_BANDS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("vitc_music_bookings");
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [instrumentRequests, setInstrumentRequests] = useState(() => {
    const saved = localStorage.getItem("vitc_music_instruments");
    return saved ? JSON.parse(saved) : INITIAL_INSTRUMENT_REQUESTS;
  });

  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem("vitc_music_all_users");
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // ---------------- FETCH LIVE DATA FROM SUPABASE ----------------
  const fetchLiveBookings = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('slot_bookings')
        .select('*')
        .order('slot_date', { ascending: false });

      if (error) {
        console.warn('[Supabase] slot_bookings read error:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const formatted = data.map(b => ({
          id: b.id,
          date: b.slot_date,
          day: new Date(b.slot_date).toLocaleDateString('en-US', { weekday: 'long' }),
          timeSlot: b.time_slot,
          bookingMode: b.band_name ? 'Bands' : (b.block_reason ? 'Block' : 'Self'),
          bandName: b.band_name,
          bookerName: b.booker_name,
          bookerReg: b.booker_reg,
          blockReason: b.block_reason,
          membersInfo: b.members_info,
          status: b.status,
          createdAt: b.created_at?.split('T')[0] || ''
        }));
        setBookings(formatted);
        console.log(`%c[Supabase] Synced ${data.length} slot bookings`, 'color: #38bdf8');
      }
    } catch (err) {
      console.error('[Supabase] slot_bookings exception:', err);
    }
  }, []);

  const fetchLiveBands = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('bands')
        .select('*, band_members(*)');

      if (error) {
        console.warn('[Supabase] bands read error:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const formatted = data.map(b => ({
          id: b.id,
          name: b.name,
          genre: b.genre || 'Rock / Fusion',
          leader: b.leader_name,
          madeBy: b.leader_name,
          status: b.status || 'Approved',
          createdAt: b.created_at?.split('T')[0] || '',
          memberCount: (b.band_members || []).length || 1,
          members: (b.band_members || []).map(m => ({
            name: m.member_name,
            reg: m.register_number,
            key: m.secret_key || ''
          })),
          memberNames: (b.band_members || []).map(m => m.member_name),
          registerNumbers: (b.band_members || []).map(m => m.register_number),
          secretKeys: (b.band_members || []).map(m => m.secret_key || '')
        }));
        setBands(formatted);
        console.log(`%c[Supabase] Synced ${data.length} bands`, 'color: #38bdf8');
      }
    } catch (err) {
      console.error('[Supabase] bands exception:', err);
    }
  }, []);

  const fetchLiveUsers = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] profiles read error:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const formatted = data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          regNumber: u.reg_number,
          role: u.role || 'Musician',
          type: u.is_admin ? 'Admin' : 'User',
          verified: u.is_verified ? 'Verified' : 'Unverified',
          secretKey: u.secret_key
        }));
        setAllUsers(formatted);
        console.log(`%c[Supabase] Synced ${data.length} profiles`, 'color: #38bdf8');
      }
    } catch (err) {
      console.error('[Supabase] profiles exception:', err);
    }
  }, []);

  const fetchLiveInstrumentRequests = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('instrument_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] instrument_requests read error:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const formatted = data.map(r => ({
          id: r.id,
          instrumentName: r.instrument_name,
          instrumentCode: r.instrument_code,
          borrowDate: r.borrow_date,
          returnDate: r.return_date,
          borrowTime: '17:30',
          returnTime: '10:00',
          purpose: r.event_name || 'Music Club Practice',
          status: r.status,
          requester: r.booker_name,
          regNumber: r.booker_reg,
          createdAt: r.created_at?.split('T')[0] || ''
        }));
        setInstrumentRequests(formatted);
        console.log(`%c[Supabase] Synced ${data.length} instrument requests`, 'color: #38bdf8');
      }
    } catch (err) {
      console.error('[Supabase] instrument_requests exception:', err);
    }
  }, []);

  const refreshAllLiveData = useCallback(async () => {
    await Promise.allSettled([
      fetchLiveBookings(),
      fetchLiveBands(),
      fetchLiveUsers(),
      fetchLiveInstrumentRequests()
    ]);
  }, [fetchLiveBookings, fetchLiveBands, fetchLiveUsers, fetchLiveInstrumentRequests]);

  // Initial load and Realtime Subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Load user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else if (!localStorage.getItem("vitc_music_user")) {
        setUser(null);
      }
    });

    // Initial fetch of all tables
    refreshAllLiveData();

    // Realtime listeners
    const channel = supabase
      .channel('schema_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'slot_bookings' }, () => {
        fetchLiveBookings();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bands' }, () => {
        fetchLiveBands();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'band_members' }, () => {
        fetchLiveBands();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchLiveUsers();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'instrument_requests' }, () => {
        fetchLiveInstrumentRequests();
      })
      .subscribe();

    return () => {
      authListener?.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [refreshAllLiveData, fetchLiveBookings, fetchLiveBands, fetchLiveUsers, fetchLiveInstrumentRequests]);

  const loadUserProfile = async (userId) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data && !error) {
        const profile = {
          id: data.id,
          name: data.name,
          email: data.email,
          regNumber: data.reg_number,
          role: data.role || 'Musician',
          instrument: data.instrument || 'Guitar / Vocals',
          secretKey: data.secret_key,
          verified: data.is_verified,
          isAdmin: data.is_admin
        };
        setUser(profile);
        if (data.is_admin) setIsAdmin(true);
      }
    } catch (err) {
      console.warn("Could not load Supabase profile:", err);
    }
  };

  // Local persistence sync
  useEffect(() => {
    if (user) {
      localStorage.setItem("vitc_music_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("vitc_music_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("vitc_music_is_admin", JSON.stringify(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem("vitc_music_bands", JSON.stringify(bands));
  }, [bands]);

  useEffect(() => {
    localStorage.setItem("vitc_music_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("vitc_music_instruments", JSON.stringify(instrumentRequests));
  }, [instrumentRequests]);

  useEffect(() => {
    localStorage.setItem("vitc_music_all_users", JSON.stringify(allUsers));
  }, [allUsers]);

  const loginAsDemo = () => {
    setUser(DEFAULT_MEMBER);
    showToast("Signed in as Demo Club Member (Michael Dias)");
  };

  const loginWithCredentials = async (userData) => {
    if (isSupabaseConfigured && supabase && userData.email && userData.password) {
      try {
        if (userData.isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              data: {
                name: userData.name,
                reg_number: userData.regNumber,
                role: userData.role,
                instrument: userData.role
              }
            }
          });
          if (error) throw error;
          showToast("Account created! Please check your email for verification.");
          return;
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password
          });
          if (error) throw error;
          showToast(`Welcome back, ${data.user?.user_metadata?.name || 'Musician'}!`);
          return;
        }
      } catch (err) {
        showToast(err.message || "Authentication failed", "error");
        return;
      }
    }

    // Offline / Demo fallback
    const newUser = {
      id: `USR-VITC-${Date.now().toString().slice(-4)}`,
      name: userData.name || "Club Member",
      email: userData.email,
      regNumber: userData.regNumber || "24BCE5259",
      role: userData.role || "Active Member",
      instrument: "Musician",
      yearOfStudy: "B.Tech",
      joinedYear: new Date().getFullYear().toString(),
      secretKey: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
      verified: true
    };
    setUser(newUser);
    showToast(`Welcome to VITC Music Club, ${newUser.name}!`);
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    showToast("Signed out of Member Portal", "info");
  };

  // ---------------- BANDS ACTIONS ----------------
  const addBand = async (newBand) => {
    const bandRecord = {
      id: `band-${Date.now()}`,
      ...newBand,
      status: "Approved",
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBands(prev => [bandRecord, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: bandRow, error: bandErr } = await supabase
          .from('bands')
          .insert({
            name: newBand.name,
            genre: newBand.genre,
            leader_name: newBand.leader || user?.name || 'Leader',
            status: 'Approved'
          })
          .select()
          .single();

        if (bandErr) throw bandErr;

        if (bandRow && newBand.memberNames) {
          const membersToInsert = newBand.memberNames.map((name, i) => ({
            band_id: bandRow.id,
            member_name: name,
            register_number: newBand.registerNumbers?.[i] || '',
            secret_key: newBand.secretKeys?.[i] || ''
          }));
          await supabase.from('band_members').insert(membersToInsert);
        }
      } catch (err) {
        console.error("Failed to sync band to Supabase:", err);
      }
    }

    showToast(`Band "${newBand.name}" registered successfully!`);
    return bandRecord;
  };

  const updateAdminBand = async (updatedBand) => {
    setBands(prev => prev.map(b => b.id === updatedBand.id ? updatedBand : b));
    showToast(`Updated band "${updatedBand.name}"`);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('bands')
          .update({
            name: updatedBand.name,
            genre: updatedBand.genre,
            leader_name: updatedBand.madeBy || updatedBand.leader
          })
          .eq('id', updatedBand.id);

        if (updatedBand.members) {
          await supabase.from('band_members').delete().eq('band_id', updatedBand.id);
          const memberRows = updatedBand.members.map(m => ({
            band_id: updatedBand.id,
            member_name: m.name,
            register_number: m.reg,
            secret_key: m.key
          }));
          await supabase.from('band_members').insert(memberRows);
        }
      } catch (err) {
        console.error("Update band in Supabase error:", err);
      }
    }
  };

  const deleteAdminBand = async (bandId) => {
    setBands(prev => prev.filter(b => b.id !== bandId));
    showToast(`Deleted band`, 'info');

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('bands').delete().eq('id', bandId);
      } catch (err) {
        console.error("Delete band in Supabase error:", err);
      }
    }
  };

  // ---------------- BOOKINGS ACTIONS ----------------
  const addBooking = async (newBooking) => {
    const isBlock = newBooking.bookingMode === 'Block';
    const bookingRecord = {
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newBooking,
      status: isBlock ? "Blocked" : "Approved",
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBookings(prev => [bookingRecord, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('slot_bookings')
          .insert({
            id: bookingRecord.id,
            slot_date: newBooking.date,
            time_slot: newBooking.timeSlot,
            booker_name: newBooking.bookerName || user?.name || 'Member',
            booker_reg: newBooking.bookerReg || user?.regNumber || '24BCE5259',
            band_name: newBooking.bandName || null,
            members_info: newBooking.membersInfo || [],
            status: isBlock ? 'Blocked' : 'Approved',
            block_reason: newBooking.blockReason || null
          });

        if (error) {
          if (error.code === '23505') {
            showToast("This slot is already booked or blocked!", "error");
            return null;
          }
          console.error("Booking sync error:", error);
        }
      } catch (err) {
        console.error("Failed to sync booking to Supabase:", err);
      }
    }

    showToast(isBlock ? "Time slot blocked successfully." : "Practice slot booked successfully!");
    return bookingRecord;
  };

  const updateBookingStatus = async (id, newStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
    );

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('slot_bookings')
          .update({ status: newStatus })
          .eq('id', id);
      } catch (err) {
        console.error("Booking status sync error:", err);
      }
    }

    showToast(`Booking marked as ${newStatus}`);
  };

  const deleteBooking = async (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('slot_bookings').delete().eq('id', bookingId);
      } catch (err) {
        console.error("Delete booking error:", err);
      }
    }
  };

  // ---------------- INSTRUMENT ACTIONS ----------------
  const addInstrumentRequest = async (newRequest) => {
    const reqRecord = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newRequest,
      status: "Pending",
      requester: user ? user.name : "Club Member",
      regNumber: user ? user.regNumber : "24BCE5259",
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInstrumentRequests(prev => [reqRecord, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('instrument_requests')
          .insert({
            id: reqRecord.id,
            instrument_name: newRequest.instrumentName,
            instrument_code: newRequest.instrumentCode,
            borrow_date: newRequest.borrowDate,
            return_date: newRequest.returnDate,
            event_name: newRequest.purpose,
            booker_name: user ? user.name : "Club Member",
            booker_reg: user ? user.regNumber : "24BCE5259",
            status: 'Pending'
          });
      } catch (err) {
        console.error("Failed to sync instrument request:", err);
      }
    }

    showToast(`Requisition submitted for ${newRequest.instrumentName}!`);
    return reqRecord;
  };

  const updateInstrumentStatus = async (id, newStatus) => {
    setInstrumentRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('instrument_requests')
          .update({ status: newStatus })
          .eq('id', id);
      } catch (err) {
        console.error("Instrument status sync error:", err);
      }
    }

    showToast(`Instrument request marked as ${newStatus}`);
  };

  // ---------------- USER & VERIFICATION ACTIONS ----------------
  const verifyMember = async (userIdOrReg) => {
    let targetName = '';
    let targetNextStatus = 'Verified';

    setAllUsers(prev => prev.map(u => {
      if (u.id === userIdOrReg || u.regNumber === userIdOrReg) {
        targetName = u.name;
        targetNextStatus = u.verified === 'Verified' ? 'Unverified' : 'Verified';
        return { ...u, verified: targetNextStatus };
      }
      return u;
    }));

    showToast(`${targetName || userIdOrReg} is now marked ${targetNextStatus}`);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ is_verified: targetNextStatus === 'Verified' })
          .or(`id.eq.${userIdOrReg},reg_number.eq.${userIdOrReg}`);
      } catch (err) {
        console.error("Verify member in Supabase error:", err);
      }
    }
  };

  const updateAdminUser = async (updatedUser) => {
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    showToast(`Updated member account: ${updatedUser.name}`);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            name: updatedUser.name,
            email: updatedUser.email,
            reg_number: updatedUser.regNumber,
            role: updatedUser.role,
            is_admin: updatedUser.type === 'Admin',
            is_verified: updatedUser.verified === 'Verified'
          })
          .eq('id', updatedUser.id);
      } catch (err) {
        console.error("Update profile in Supabase error:", err);
      }
    }
  };

  const deleteAdminUser = async (userId) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    showToast(`Deleted member account`, 'info');

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').delete().eq('id', userId);
      } catch (err) {
        console.error("Delete profile in Supabase error:", err);
      }
    }
  };

  const toggleAdmin = () => {
    setIsAdmin(prev => {
      const next = !prev;
      showToast(next ? "Superuser / Board Admin Mode Enabled" : "Returned to Member View", "info");
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        bands,
        bookings,
        instrumentRequests,
        allUsers,
        toast,
        loginAsDemo,
        loginWithCredentials,
        logout,
        addBand,
        updateAdminBand,
        deleteAdminBand,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        addInstrumentRequest,
        updateInstrumentStatus,
        verifyMember,
        updateAdminUser,
        deleteAdminUser,
        toggleAdmin,
        showToast,
        refreshAllLiveData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

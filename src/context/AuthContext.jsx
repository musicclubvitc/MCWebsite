import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

const DEFAULT_MEMBER = {
  id: "USR-VITC-2024-8842",
  name: "Michael Dias",
  email: "michael.dias2024@vitstudent.ac.in",
  regNumber: "24BCE5259",
  role: "Creative Head",
  instrument: "Guitar / Vocals",
  yearOfStudy: "3rd Year B.Tech CSE",
  joinedYear: "2024",
  secretKey: "88ff9228ab6faf06939fb624",
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
    borrowDate: "2025-02-18",
    borrowTime: "17:30",
    returnDate: "2025-02-19",
    returnTime: "10:00",
    purpose: "College Cultural Fest Band Showcase",
    status: "Approved",
    requester: "Aarav Sharma",
    regNumber: "22BCE1289",
    createdAt: "2025-02-11"
  },
  {
    id: "REQ-8022",
    instrumentName: "Roland XPS-30 Synthesizer",
    instrumentCode: "KEY-ROL-01",
    borrowDate: "2025-02-25",
    borrowTime: "15:00",
    returnDate: "2025-02-26",
    returnTime: "18:00",
    purpose: "Live Track Sequencing & Stage Audition",
    status: "Pending",
    requester: "Aarav Sharma",
    regNumber: "22BCE1289",
    createdAt: "2025-02-15"
  },
  {
    id: "REQ-7994",
    instrumentName: "Shure SM58 Dynamic Vocal Microphones (Set of 3)",
    instrumentCode: "MIC-SHU-03",
    borrowDate: "2025-01-12",
    borrowTime: "14:00",
    returnDate: "2025-01-13",
    returnTime: "12:00",
    purpose: "Acoustic Unplugged Evening Rehearsal",
    status: "Returned",
    requester: "Aarav Sharma",
    regNumber: "22BCE1289",
    createdAt: "2025-01-08"
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("vitc_music_user");
    return saved ? JSON.parse(saved) : DEFAULT_MEMBER;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem("vitc_music_is_admin");
    return saved ? JSON.parse(saved) : false;
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

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1. SUPABASE REALTIME & DATA SYNC
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    // Listen for auth state changes
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else if (!localStorage.getItem("vitc_music_user")) {
        setUser(null);
      }
    });

    // Fetch live slot bookings
    const fetchLiveBookings = async () => {
      const { data, error } = await supabase
        .from('slot_bookings')
        .select('*')
        .order('slot_date', { ascending: false });

      if (data && !error) {
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
          createdAt: b.created_at
        }));
        setBookings(formatted);
      }
    };

    fetchLiveBookings();

    // Subscribe to realtime slot updates
    const channel = supabase
      .channel('slot_bookings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'slot_bookings' }, () => {
        fetchLiveBookings();
      })
      .subscribe();

    return () => {
      authListener?.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const loadUserProfile = async (userId) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

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

  const loginAsDemo = () => {
    setUser(DEFAULT_MEMBER);
    showToast("Signed in as Demo Club Member (Michael Dias)");
  };

  const loginWithCredentials = async (userData) => {
    // If Supabase is connected, attempt Supabase Auth
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
        const { data: bandRow } = await supabase
          .from('bands')
          .insert({
            name: newBand.name,
            genre: newBand.genre,
            leader_name: newBand.leader || user?.name || 'Leader',
            status: 'Approved'
          })
          .select()
          .single();

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
            showToast("This slot is already booked or blocked by another member!", "error");
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

  const verifyMember = async (regNumber) => {
    showToast(`Member ${regNumber} verified successfully!`);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ is_verified: true })
          .eq('reg_number', regNumber);
      } catch (err) {
        console.error("Verify member error:", err);
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
        toast,
        loginAsDemo,
        loginWithCredentials,
        logout,
        addBand,
        addBooking,
        updateBookingStatus,
        addInstrumentRequest,
        updateInstrumentStatus,
        verifyMember,
        toggleAdmin,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

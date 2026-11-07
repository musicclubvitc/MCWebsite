import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export const isUserInBand = (band, user) => {
  if (!band || !user) return false;
  const userReg = (user.regNumber || '').trim().toUpperCase();
  const userName = (user.name || '').trim().toLowerCase();
  const userKey = (user.secretKey || user.id || '').trim();

  // 1. Leader / Made by check
  const leader = (band.leader || band.madeBy || '').trim().toLowerCase();
  if (userName && leader && userName === leader) return true;

  // 2. Register number match
  if (userReg) {
    if ((band.registerNumbers || []).some(r => (r || '').trim().toUpperCase() === userReg)) return true;
    if ((band.members || []).some(m => (m.reg || '').trim().toUpperCase() === userReg)) return true;
  }

  // 3. Secret Key match
  if (userKey) {
    if ((band.secretKeys || []).some(k => (k || '').trim() === userKey)) return true;
    if ((band.members || []).some(m => (m.key || '').trim() === userKey)) return true;
  }

  // 4. Member name match as fallback
  if (userName) {
    if ((band.memberNames || []).some(n => (n || '').trim().toLowerCase() === userName)) return true;
    if ((band.members || []).some(m => (m.name || '').trim().toLowerCase() === userName)) return true;
  }

  return false;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("vitc_music_user");
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed) {
        const isVerified = Boolean(parsed.verified === true || parsed.verified === 'Verified' || parsed.is_verified);
        const isAdmin = Boolean(parsed.isAdmin || parsed.is_admin || parsed.type === 'Admin');
        if (!isVerified && !isAdmin) {
          localStorage.removeItem("vitc_music_user");
          return null;
        }
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // Admin access is strictly derived from user's verified privileges in database (no demo switch)
  const isAdmin = Boolean(user && (user.isAdmin || user.is_admin || user.type === 'Admin'));

  const [bands, setBands] = useState(() => {
    try {
      const saved = localStorage.getItem("vitc_music_bands");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem("vitc_music_bookings");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [instrumentRequests, setInstrumentRequests] = useState(() => {
    try {
      const saved = localStorage.getItem("vitc_music_instruments");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [instruments, setInstruments] = useState(() => {
    try {
      const saved = localStorage.getItem("vitc_music_instruments_inventory");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [allUsers, setAllUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("vitc_music_all_users");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
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
        .order('slot_date', { ascending: true });

      if (error) {
        console.warn('[Supabase] slot_bookings read error:', error.message);
        return;
      }

      if (data) {
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
        .select('*, band_members(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] bands read error:', error.message);
        return;
      }

      if (data) {
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

      if (data) {
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
        .order('borrow_date', { ascending: true });

      if (error) {
        console.warn('[Supabase] instrument_requests read error:', error.message);
        return;
      }

      if (data) {
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

  const fetchLiveInstruments = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('instruments')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.warn('[Supabase] instruments read error:', error.message);
        return;
      }

      if (data) {
        const formatted = data.map(i => ({
          id: i.id,
          name: i.name,
          category: i.category,
          code: i.code,
          location: i.location || 'Music Room',
          condition: i.condition || 'Good',
          available: i.available !== false,
          image: i.image || '',
          createdAt: i.created_at?.split('T')[0] || ''
        }));
        setInstruments(formatted);
        console.log(`%c[Supabase] Synced ${data.length} instruments`, 'color: #38bdf8');
      }
    } catch (err) {
      console.error('[Supabase] instruments exception:', err);
    }
  }, []);

  const refreshAllLiveData = useCallback(async () => {
    await Promise.allSettled([
      fetchLiveBookings(),
      fetchLiveBands(),
      fetchLiveUsers(),
      fetchLiveInstrumentRequests(),
      fetchLiveInstruments()
    ]);
  }, [fetchLiveBookings, fetchLiveBands, fetchLiveUsers, fetchLiveInstrumentRequests, fetchLiveInstruments]);

  // Initial load and Realtime Subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Load user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email);
      }
    });

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email);
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'instruments' }, () => {
        fetchLiveInstruments();
      })
      .subscribe();

    return () => {
      authListener?.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [refreshAllLiveData, fetchLiveBookings, fetchLiveBands, fetchLiveUsers, fetchLiveInstrumentRequests, fetchLiveInstruments]);

  const loadUserProfile = async (userId, userEmail) => {
    if (!supabase) return;
    try {
      let query = supabase.from('profiles').select('*');
      if (userEmail) {
        query = query.or(`id.eq.${userId},user_id.eq.${userId},email.eq.${userEmail}`);
      } else {
        query = query.or(`id.eq.${userId},user_id.eq.${userId}`);
      }
      const { data, error } = await query.maybeSingle();

      if (error) {
        console.warn("Could not load Supabase profile:", error);
        return;
      }

      if (data) {
        const isVerified = Boolean(data.is_verified);
        const isAdmin = Boolean(data.is_admin);

        // Non-verified, non-admin members cannot log in or maintain a session
        if (!isVerified && !isAdmin) {
          console.warn("Blocked unverified member session:", data.email);
          await supabase.auth.signOut();
          setUser(null);
          localStorage.removeItem("vitc_music_user");
          showToast("Your account is not yet verified. Please ask an admin for approval.", "error");
          return;
        }

        const profile = {
          id: data.id,
          name: data.name,
          email: data.email,
          regNumber: data.reg_number,
          role: data.role || 'Musician',
          instrument: data.instrument || 'Guitar / Vocals',
          secretKey: data.secret_key,
          verified: data.is_verified,
          isAdmin: isAdmin
        };
        setUser(profile);
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
    localStorage.setItem("vitc_music_bands", JSON.stringify(bands));
  }, [bands]);

  useEffect(() => {
    localStorage.setItem("vitc_music_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("vitc_music_instruments", JSON.stringify(instrumentRequests));
  }, [instrumentRequests]);

  useEffect(() => {
    localStorage.setItem("vitc_music_instruments_inventory", JSON.stringify(instruments));
  }, [instruments]);

  useEffect(() => {
    localStorage.setItem("vitc_music_all_users", JSON.stringify(allUsers));
  }, [allUsers]);

  const loginAsDemo = () => {
    showToast("Demo account is disabled for production deployment. Please sign in or register.", "info");
  };

  const loginWithCredentials = async (userData) => {
    if (isSupabaseConfigured && supabase && userData.email && userData.password) {
      try {
        if (userData.isSignUp) {
          const redirectOrigin = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined;
          const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              emailRedirectTo: redirectOrigin,
              data: {
                name: userData.name,
                reg_number: userData.regNumber,
                role: userData.role,
                instrument: userData.role
              }
            }
          });
          if (error) throw error;

          // Ensure unverified user is logged out immediately so they cannot enter portal
          await supabase.auth.signOut();
          setUser(null);
          localStorage.removeItem("vitc_music_user");

          showToast("Account created! Your account is pending admin approval before you can log in.", "info");
          return { success: true, pendingApproval: true };
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password
          });
          if (error) throw error;

          // Check if user is verified in profiles table
          let profile = null;
          if (data?.user) {
            const { data: profData } = await supabase
              .from('profiles')
              .select('*')
              .or(`id.eq.${data.user.id},user_id.eq.${data.user.id},email.eq.${data.user.email}`)
              .maybeSingle();
            profile = profData;
          }

          const isVerified = Boolean(profile?.is_verified);
          const isAdmin = Boolean(profile?.is_admin);

          if (!profile || (!isVerified && !isAdmin)) {
            // Reject unverified login immediately
            await supabase.auth.signOut();
            setUser(null);
            localStorage.removeItem("vitc_music_user");
            const unverifiedMsg = "Your account is not yet verified. Please ask an admin for approval.";
            showToast(unverifiedMsg, "error");
            return { error: unverifiedMsg };
          }

          const loadedUser = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            regNumber: profile.reg_number,
            role: profile.role || 'Musician',
            instrument: profile.instrument || 'Guitar / Vocals',
            secretKey: profile.secret_key,
            verified: profile.is_verified,
            isAdmin: isAdmin
          };
          setUser(loadedUser);
          showToast(`Welcome back, ${loadedUser.name}!`);
          return { success: true, user: loadedUser };
        }
      } catch (err) {
        showToast(err.message || "Authentication failed", "error");
        return { error: err.message || "Authentication failed" };
      }
    }

    // Offline / Local fallback with provided user data
    if (allUsers.length > 0) {
      const existing = allUsers.find(u => 
        u.email?.toLowerCase() === userData.email?.toLowerCase() || 
        (userData.regNumber && u.regNumber === userData.regNumber)
      );
      if (existing) {
        if (existing.verified !== 'Verified' && existing.type !== 'Admin') {
          const unverifiedMsg = "Your account is not yet verified. Please ask an admin for approval.";
          showToast(unverifiedMsg, "error");
          return { error: unverifiedMsg };
        }
      } else if (!userData.isSignUp) {
        const notFoundMsg = "Account not found or not yet approved. Please register or contact an admin.";
        showToast(notFoundMsg, "error");
        return { error: notFoundMsg };
      }
    }

    if (userData.isSignUp) {
      showToast("Account created! Please ask an admin for approval.", "info");
      return { success: true, pendingApproval: true };
    }

    const newUser = {
      id: `USR-VITC-${Date.now().toString().slice(-4)}`,
      name: userData.name || "Club Member",
      email: userData.email,
      regNumber: userData.regNumber || "",
      role: userData.role || "Active Member",
      instrument: "Musician",
      yearOfStudy: "B.Tech",
      joinedYear: new Date().getFullYear().toString(),
      secretKey: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
      verified: true,
      isAdmin: false
    };
    setUser(newUser);
    showToast(`Welcome to VITC Music Club, ${newUser.name}!`);
    return { success: true, user: newUser };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem("vitc_music_user");
    localStorage.removeItem("vitc_music_is_admin");
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
            id: bandRecord.id,
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
    // Admin bookings are Approved (or Blocked). Non-admin member bookings start as Pending approval!
    const initialStatus = isBlock 
      ? 'Blocked' 
      : (isAdmin ? (newBooking.status || 'Approved') : 'Pending');

    const bookingRecord = {
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newBooking,
      status: initialStatus,
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
            booker_reg: newBooking.bookerReg || user?.regNumber || '',
            band_name: newBooking.bandName || null,
            members_info: newBooking.membersInfo || [],
            status: initialStatus,
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

    if (isBlock) {
      showToast("Time slot blocked successfully.");
    } else if (initialStatus === 'Pending') {
      showToast("Booking submitted! Awaiting admin approval.", "info");
    } else {
      showToast("Practice slot booked successfully!");
    }
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

  // ---------------- GEAR INVENTORY ACTIONS ----------------
  const addInstrument = async (item) => {
    const newInst = {
      id: item.id || `INST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: item.name,
      category: item.category || 'Gear',
      code: item.code || `GEAR-${Date.now().toString().slice(-4)}`,
      location: item.location || 'Music Room',
      condition: item.condition || 'Good',
      available: item.available !== false,
      image: item.image || ''
    };
    setInstruments(prev => [newInst, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('instruments').insert({
          id: newInst.id,
          name: newInst.name,
          category: newInst.category,
          code: newInst.code,
          location: newInst.location,
          condition: newInst.condition,
          available: newInst.available,
          image: newInst.image
        });
        if (error) console.error("Error inserting gear into Supabase:", error);
      } catch (err) {
        console.error("Failed to add instrument to Supabase:", err);
      }
    }
    showToast(`Added ${newInst.name} to gear inventory!`);
    return newInst;
  };

  const updateInstrument = async (id, updates) => {
    setInstruments(prev =>
      prev.map(inst => (inst.id === id ? { ...inst, ...updates } : inst))
    );

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('instruments')
          .update(updates)
          .eq('id', id);
        if (error) console.error("Error updating gear in Supabase:", error);
      } catch (err) {
        console.error("Failed to update gear in Supabase:", err);
      }
    }
    showToast("Gear inventory updated.");
  };

  const deleteInstrument = async (id) => {
    setInstruments(prev => prev.filter(inst => inst.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('instruments')
          .delete()
          .eq('id', id);
        if (error) console.error("Error deleting gear from Supabase:", error);
      } catch (err) {
        console.error("Failed to delete gear from Supabase:", err);
      }
    }
    showToast("Equipment removed from inventory.", "info");
  };

  // ---------------- INSTRUMENT REQUISITION ACTIONS ----------------
  const addInstrumentRequest = async (newRequest) => {
    const reqRecord = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newRequest,
      status: "Pending",
      requester: user ? user.name : "Club Member",
      regNumber: user ? user.regNumber : "",
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInstrumentRequests(prev => [reqRecord, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('instrument_requests')
          .insert({
            id: reqRecord.id,
            instrument_name: newRequest.instrumentName,
            instrument_code: newRequest.instrumentCode,
            borrow_date: newRequest.borrowDate,
            return_date: newRequest.returnDate,
            event_name: newRequest.purpose,
            booker_name: user ? user.name : "Club Member",
            booker_reg: user ? user.regNumber : "",
            status: 'Pending'
          });
        if (error) console.error("Error creating instrument request in Supabase:", error);
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
        const { error } = await supabase
          .from('instrument_requests')
          .update({ status: newStatus })
          .eq('id', id);
        if (error) console.error("Error updating instrument request in Supabase:", error);
      } catch (err) {
        console.error("Instrument status sync error:", err);
      }
    }

    showToast(`Instrument request marked as ${newStatus}`);
  };

  const deleteInstrumentRequest = async (id) => {
    setInstrumentRequests(prev => prev.filter(r => r.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('instrument_requests')
          .delete()
          .eq('id', id);
        if (error) console.error("Error deleting instrument request in Supabase:", error);
      } catch (err) {
        console.error("Delete instrument request error:", err);
      }
    }

    showToast("Instrument requisition deleted", "info");
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
    // Admin mode is automatically determined by user role in database
  };

  const myBands = useMemo(() => {
    if (!user) return [];
    return bands.filter(b => isUserInBand(b, user));
  }, [bands, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        bands,
        myBands,
        isUserInBand,
        bookings,
        instruments,
        instrumentRequests,
        allUsers,
        toast,
        setToast,
        loginAsDemo,
        loginWithCredentials,
        logout,
        addBand,
        updateAdminBand,
        deleteAdminBand,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        addInstrument,
        updateInstrument,
        deleteInstrument,
        fetchLiveInstruments,
        addInstrumentRequest,
        updateInstrumentStatus,
        deleteInstrumentRequest,
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

const isMockMode = !import.meta.env.VITE_API_URL;

// Base URL for the BrewMe backend API.
// Override in development by adding VITE_API_URL to frontend/.env.
export const API_BASE = isMockMode
  ? "/api/v1"
  : (import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1");

// Origin (without the /api/v1 suffix) — used to build absolute URLs for static
// assets like uploaded avatars (e.g. `${API_ORIGIN}${user.avatar_url}`).
export const API_ORIGIN = isMockMode ? "" : API_BASE.replace(/\/api\/v1\/?$/, "");

if (isMockMode) {
  const initMockDb = () => {
    let db = null;
    try {
      db = JSON.parse(localStorage.getItem("brewme_mock_db"));
    } catch (e) {}

    if (db && db.users && db.posts && db.tiers && db.supporters && db.payouts) {
      return db;
    }

    // Seed Data
    db = {
      users: [
        {
          id: 1,
          name: "BrewMaster",
          email: "demo@brewme.com",
          password: "password",
          username: "demo",
          bio: "Hey! I'm creating premium tutorials on web development, coffee brewing techniques, and UI/UX design. Support my journey!",
          category: "Software",
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          cover_image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
          total_supporters: 14,
          total_cups: 57,
          goal_title: "Upgrade to a professional studio microphone for recording new courses.",
          goal_amount: 500,
          stripe_connected: true,
          creator_links: ["https://github.com", "https://twitter.com"],
          balance: 250.00,
          total_earned: 1250.00,
          payouts_sum: 875.00,
          notifications: {
            email_supporter: true,
            email_post: true
          }
        },
        {
          id: 2,
          name: "Alice Vance",
          email: "alice@brewme.com",
          password: "password",
          username: "alice",
          bio: "Digital painting & fantasy concept artist. Sharing brushes, tutorials and early previews.",
          category: "Art",
          avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          cover_image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80",
          total_supporters: 42,
          total_cups: 120,
          goal_title: "Getting new iPad Pro for digital drawing.",
          goal_amount: 1000,
          stripe_connected: true,
          creator_links: ["https://instagram.com/alice"],
          balance: 100.00,
          total_earned: 600.00,
          payouts_sum: 500.00,
          notifications: {
            email_supporter: true,
            email_post: false
          }
        },
        {
          id: 3,
          name: "Bob Marley",
          email: "bob@brewme.com",
          password: "password",
          username: "bob",
          bio: "Indie singer-songwriter. Weekly acoustic covers, behind-the-scenes, and audio stems.",
          category: "Music",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          cover_image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
          total_supporters: 29,
          total_cups: 85,
          goal_title: "Funding my next EP studio recording.",
          goal_amount: 1500,
          stripe_connected: true,
          creator_links: ["https://spotify.com/bob"],
          balance: 425.00,
          total_earned: 425.00,
          payouts_sum: 0,
          notifications: {
            email_supporter: true,
            email_post: true
          }
        }
      ],
      posts: [
        {
          id: 1,
          username: "demo",
          title: "Unlocking the Power of CSS Grid & Flexbox",
          preview: "CSS Grid and Flexbox are the pillars of modern layout design. In this post, we explore advanced alignment tricks, nested containers, and responsiveness using purely CSS rules.",
          body: "CSS Grid and Flexbox are the pillars of modern layout design. In this post, we explore advanced alignment tricks, nested containers, and responsiveness using purely CSS rules.\n\nFlexbox is perfect for one-dimensional layouts (a single row or column), while Grid is designed for two-dimensional layouts. Combining them gives you ultimate control over your layout hierarchy without writing bloated media queries.\n\nKey takeaways:\n1. Use `gap` instead of margins on children.\n2. Leverage `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` for fluid layouts.\n3. Make use of alignment utilities for centering inside flex containers.",
          image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
          visibility: "public",
          status: "published",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          username: "demo",
          title: "Exclusive: Building a Custom Hooks Library in React",
          preview: "Here is a deep-dive walkthrough of my personal custom hooks folder, including useLocalStorage, useDebounce, and useEventListener. This post is exclusive to my Gold Members and above!",
          body: "Here is a deep-dive walkthrough of my personal custom hooks folder, including useLocalStorage, useDebounce, and useEventListener. This post is exclusive to my Gold Members and above!\n\nCustom hooks allow you to extract component logic into reusable functions. By leveraging hooks, you avoid duplication and make your codebase extremely clean.\n\nFor example, `useLocalStorage` abstracts reading and writing state to localStorage, synchronizing it across component updates. Code snippet is available below for subscribers.",
          image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
          visibility: "members",
          status: "published",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          username: "demo",
          title: "My Coffee Brewing Setup for High Productivity",
          preview: "A detailed breakdown of my V60 setup, the scale I use, and how water temperature affects bean extraction. Coffee is literally the fuel for my coding sessions!",
          body: "A detailed breakdown of my V60 setup, the scale I use, and how water temperature affects bean extraction. Coffee is literally the fuel for my coding sessions!\n\nEquipment list:\n- Hario V60 ceramic dripper\n- Fellow Stagg EKG kettle\n- Comandante C40 grinder\n\nMethod:\n1. 15g coffee to 250g water (94°C).\n2. 45s bloom with 45g water.\n3. Pour up to 150g by 1:15.\n4. Pour up to 250g by 2:00. Enjoy!",
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
          visibility: "public",
          status: "published",
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      tiers: [
        {
          id: 1,
          username: "demo",
          name: "Supporter",
          price: 5,
          subscriber_count: 8,
          perks: ["Exclusive posts", "Supporter badge"]
        },
        {
          id: 2,
          username: "demo",
          name: "Gold Member",
          price: 15,
          subscriber_count: 3,
          perks: ["Monthly Q&A", "Early access to code templates", "Discord Role"]
        }
      ],
      supporters: [
        {
          id: 1,
          creator_username: "demo",
          supporter_name: "Sarah Jenkins",
          support_type: "coffee",
          supporter_cups: 3,
          total_amount: 15.00,
          supporter_message: "Your React tutorials helped me land my first junior developer job! Thank you so much!",
          support_replied: true,
          creator_reply: "Wow Sarah, that is amazing news! Congratulations on the job, you've earned it!",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          creator_username: "demo",
          supporter_name: "David Miller",
          support_type: "coffee",
          supporter_cups: 1,
          total_amount: 5.00,
          supporter_message: "Keep up the awesome open source work.",
          support_replied: false,
          creator_reply: null,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          creator_username: "demo",
          supporter_name: "Jessica Taylor",
          support_type: "membership",
          supporter_cups: 0,
          total_amount: 15.00,
          supporter_message: "Excited to be a Gold Member. The discord channel is super helpful!",
          support_replied: true,
          creator_reply: "Welcome aboard Jessica! Great to have you in the discord server.",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          creator_username: "demo",
          supporter_name: "Marcus Vance",
          support_type: "coffee",
          supporter_cups: 10,
          total_amount: 50.00,
          supporter_message: "Thanks for the V60 guide! Bought you 10 coffees. Cheers!",
          support_replied: false,
          creator_reply: null,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      payouts: [
        {
          id: 1,
          username: "demo",
          amount: 875.00,
          method: "Stripe",
          status: "Completed",
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    localStorage.setItem("brewme_mock_db", JSON.stringify(db));
    return db;
  };

  const generateMockToken = (user) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      id: user.id,
      email: user.email,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + 86400
    }));
    const signature = "mock_signature";
    return `${header}.${payload}.${signature}`;
  };

  const getCurrentUserFromHeaders = (headers, db) => {
    const auth = headers.Authorization || headers.authorization || "";
    if (!auth.startsWith("Bearer ")) return null;
    const token = auth.substring(7);
    try {
      const payloadSegment = token.split(".")[1];
      const payload = JSON.parse(atob(payloadSegment));
      return db.users.find(u => u.username === payload.username || u.email === payload.email) || null;
    } catch {
      return null;
    }
  };

  const parseBody = async (body) => {
    if (!body) return {};
    if (body instanceof FormData) {
      const data = {};
      for (const [key, value] of body.entries()) {
        data[key] = value;
      }
      return data;
    }
    try {
      return typeof body === "string" ? JSON.parse(body) : body;
    } catch {
      return {};
    }
  };

  const matchPath = (path, pattern) => {
    const regexPattern = "^" + pattern.replace(/:[a-zA-Z0-9_]+/g, "([^/]+)") + "$";
    const regex = new RegExp(regexPattern);
    const match = path.match(regex);
    if (match) return match.slice(1);
    return null;
  };

  const saveDb = (updatedDb) => {
    localStorage.setItem("brewme_mock_db", JSON.stringify(updatedDb));
  };

  const originalFetch = window.fetch;
  window.fetch = async function (url, options = {}) {
    const urlString = typeof url === "string" ? url : (url.url || "");
    if (!urlString.includes("/api/v1")) {
      return originalFetch.apply(this, arguments);
    }

    const urlObj = new URL(urlString, window.location.origin);
    const path = urlObj.pathname.replace(/^\/api\/v1/, "");
    const method = (options.method || "GET").toUpperCase();
    const headers = options.headers || {};

    const db = initMockDb();
    const user = getCurrentUserFromHeaders(headers, db);
    const requestBody = await parseBody(options.body);

    const jsonResponse = (data, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
      });
    };

    // 1. /auth/login
    if (path === "/auth/login" && method === "POST") {
      const { email, password } = requestBody;
      const foundUser = db.users.find(u => u.email.toLowerCase() === (email || "").toLowerCase() && u.password === password);
      if (!foundUser) {
        return jsonResponse({ message: "Invalid email or password" }, 400);
      }
      const token = generateMockToken(foundUser);
      return jsonResponse({ token });
    }

    // 2. /auth/register
    if (path === "/auth/register" && method === "POST") {
      const { name, email, password, url: usernameVal, bio, category } = requestBody;
      if (db.users.some(u => u.email.toLowerCase() === (email || "").toLowerCase())) {
        return jsonResponse({ error: "email already exists" }, 400);
      }
      if (db.users.some(u => u.username.toLowerCase() === (usernameVal || "").toLowerCase())) {
        return jsonResponse({ error: "username already exists" }, 400);
      }
      const newUser = {
        id: db.users.length + 1,
        name,
        email,
        password,
        username: usernameVal,
        bio: bio || "",
        category: category || "Software",
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        cover_image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
        total_supporters: 0,
        total_cups: 0,
        goal_title: "",
        goal_amount: 0,
        stripe_connected: false,
        creator_links: [],
        balance: 0,
        total_earned: 0,
        payouts_sum: 0,
        notifications: { email_supporter: true, email_post: true }
      };
      db.users.push(newUser);
      saveDb(db);
      return jsonResponse({ success: true }, 201);
    }

    // 3. /auth/forgot-password
    if (path === "/auth/forgot-password" && method === "POST") {
      return jsonResponse({ success: true, message: "Reset code sent to your email." });
    }

    // 4. /auth/reset-password
    if (path === "/auth/reset-password" && method === "POST") {
      return jsonResponse({ success: true, message: "Password updated successfully." });
    }

    // 5. /auth/username-available
    if (path === "/auth/username-available" && method === "GET") {
      const checkUsername = urlObj.searchParams.get("username") || "";
      const exists = db.users.some(u => u.username.toLowerCase() === checkUsername.toLowerCase());
      return jsonResponse({ available: !exists });
    }

    // 6. /auth/logout
    if (path === "/auth/logout" && method === "POST") {
      return jsonResponse({ success: true });
    }

    // 7. /category/
    if (path === "/category/" && method === "GET") {
      return jsonResponse({
        status: true,
        category: ["Software", "Art", "Music", "Gaming", "Video", "Writing", "Podcast"]
      });
    }

    // 8. /discover
    if (path === "/discover" && method === "GET") {
      const list = db.users.map(u => ({
        creator_id: u.id,
        creator_name: u.name,
        creator_username: u.username,
        creator_category: u.category,
        creator_description: u.bio,
        creator_bio: u.bio,
        creator_profile_picture: u.avatar_url,
        creator_image: u.avatar_url,
        total_supporters_cup: u.total_cups,
        total_supporters: u.total_supporters,
        total_cups: u.total_cups
      }));
      return jsonResponse(list);
    }

    // 9. /creators/:username/supporters
    let match = matchPath(path, "/creators/:username/supporters");
    if (match && method === "GET") {
      const creatorUsername = match[0];
      const supporters = db.supporters
        .filter(s => s.creator_username.toLowerCase() === creatorUsername.toLowerCase())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return jsonResponse(supporters);
    }

    // 10. /creators/:username/posts
    match = matchPath(path, "/creators/:username/posts");
    if (match && method === "GET") {
      const creatorUsername = match[0];
      const posts = db.posts
        .filter(p => p.username.toLowerCase() === creatorUsername.toLowerCase())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return jsonResponse(posts);
    }

    // 11. /creators/:username/donations
    match = matchPath(path, "/creators/:username/donations");
    if (match && method === "POST") {
      const creatorUsername = match[0];
      const creator = db.users.find(u => u.username.toLowerCase() === creatorUsername.toLowerCase());
      if (!creator) return jsonResponse({ error: "Creator not found" }, 404);
      const cups = Number(requestBody.cups || 1);
      const name = requestBody.supporter_name || "Anonymous";
      const message = requestBody.message || "";
      const amt = cups * 5;
      const newSupp = {
        id: db.supporters.length + 1,
        creator_username: creatorUsername,
        supporter_name: name,
        support_type: "coffee",
        supporter_cups: cups,
        total_amount: amt,
        supporter_message: message,
        support_replied: false,
        creator_reply: null,
        created_at: new Date().toISOString()
      };
      db.supporters.push(newSupp);
      creator.total_cups = (creator.total_cups || 0) + cups;
      creator.total_supporters = (creator.total_supporters || 0) + 1;
      creator.total_earned = (creator.total_earned || 0) + amt;
      creator.balance = (creator.balance || 0) + amt;
      saveDb(db);
      return jsonResponse({ success: true, url: "/success" });
    }

    // 12. /creators/:username/memberships
    match = matchPath(path, "/creators/:username/memberships");
    if (match && method === "POST") {
      const creatorUsername = match[0];
      const creator = db.users.find(u => u.username.toLowerCase() === creatorUsername.toLowerCase());
      if (!creator) return jsonResponse({ error: "Creator not found" }, 404);
      const tierId = Number(requestBody.tier_id);
      const tier = db.tiers.find(t => t.id === tierId) || db.tiers[0];
      const price = tier ? tier.price : 5;
      const tierName = tier ? tier.name : "Supporter";
      const newSupp = {
        id: db.supporters.length + 1,
        creator_username: creatorUsername,
        supporter_name: requestBody.supporter_name || "Anonymous",
        support_type: "membership",
        supporter_cups: 0,
        total_amount: price,
        supporter_message: `Joined membership tier: ${tierName}`,
        support_replied: false,
        creator_reply: null,
        created_at: new Date().toISOString()
      };
      db.supporters.push(newSupp);
      if (tier) tier.subscriber_count = (tier.subscriber_count || 0) + 1;
      creator.total_supporters = (creator.total_supporters || 0) + 1;
      creator.total_earned = (creator.total_earned || 0) + price;
      creator.balance = (creator.balance || 0) + price;
      saveDb(db);
      return jsonResponse({ success: true, url: "/success" });
    }

    // 13. /creators/:username
    match = matchPath(path, "/creators/:username");
    if (match && method === "GET") {
      const creatorUsername = match[0];
      const creator = db.users.find(u => u.username.toLowerCase() === creatorUsername.toLowerCase());
      if (!creator) return jsonResponse({ error: "Creator not found" }, 404);
      const profile = {
        creator_id: creator.id,
        creator_username: creator.username,
        creator_name: creator.name,
        creator_bio: creator.bio,
        creator_category: creator.category,
        creator_image: creator.avatar_url,
        cover_image: creator.cover_image,
        total_supporters: creator.total_supporters || 0,
        total_cups: creator.total_cups || 0,
        goal_title: creator.goal_title || "",
        goal_amount: creator.goal_amount || 0,
        stripe_connected: creator.stripe_connected || false,
        creator_links: creator.creator_links || [],
        tiers: db.tiers.filter(t => t.username.toLowerCase() === creatorUsername.toLowerCase())
      };
      return jsonResponse(profile);
    }

    // Authenticated Endpoints check
    if (!user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    // 14. /profile/
    if (path === "/profile/" && method === "GET") {
      return jsonResponse({
        status: true,
        profile_info: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar_url: user.avatar_url,
          cover_image: user.cover_image,
          category: user.category,
          bio: user.bio,
          creator_links: user.creator_links || []
        }
      });
    }

    // 15. /dashboard/stats
    if (path === "/dashboard/stats" && method === "GET") {
      const myPosts = db.posts.filter(p => p.username.toLowerCase() === user.username.toLowerCase());
      return jsonResponse({
        total_earned: "$" + user.total_earned.toFixed(2),
        earnings_change: "+12%",
        monthly_earned: "$" + (user.total_earned * 0.3).toFixed(2),
        monthly_change: "+8%",
        total_supporters: user.total_supporters,
        supporters_change: "+3",
        total_posts: myPosts.length,
        posts_change: "+1"
      });
    }

    // 16. /dashboard/supporters-list
    if (path === "/dashboard/supporters-list" && method === "GET") {
      const supporters = db.supporters
        .filter(s => s.creator_username.toLowerCase() === user.username.toLowerCase())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return jsonResponse(supporters);
    }

    // 17. /dashboard/supporters/:id/reply
    match = matchPath(path, "/dashboard/supporters/:id/reply");
    if (match && method === "POST") {
      const suppId = Number(match[0]);
      const supporter = db.supporters.find(s => s.id === suppId && s.creator_username.toLowerCase() === user.username.toLowerCase());
      if (!supporter) return jsonResponse({ error: "Supporter not found" }, 404);
      supporter.support_replied = true;
      supporter.creator_reply = requestBody.message;
      saveDb(db);
      return jsonResponse({ success: true, creator_reply: requestBody.message });
    }

    // 18. /dashboard/posts GET and POST
    if (path === "/dashboard/posts") {
      if (method === "GET") {
        return jsonResponse(db.posts.filter(p => p.username.toLowerCase() === user.username.toLowerCase()));
      }
      if (method === "POST") {
        const imageFile = requestBody.image;
        const imageUrl = (imageFile && imageFile instanceof File)
          ? URL.createObjectURL(imageFile)
          : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80";
        const newPost = {
          id: db.posts.length + 1,
          username: user.username,
          title: requestBody.title || "Untitled",
          preview: requestBody.preview || "",
          body: requestBody.preview || "",
          image: imageUrl,
          visibility: requestBody.membersOnly === "true" || requestBody.membersOnly === true ? "members" : "public",
          status: requestBody.status || "published",
          created_at: new Date().toISOString()
        };
        db.posts.push(newPost);
        saveDb(db);
        return jsonResponse(newPost, 201);
      }
    }

    // 19. /dashboard/posts/:id PUT & DELETE
    match = matchPath(path, "/dashboard/posts/:id");
    if (match) {
      const postId = Number(match[0]);
      const postIndex = db.posts.findIndex(p => p.id === postId && p.username.toLowerCase() === user.username.toLowerCase());
      if (postIndex === -1) return jsonResponse({ error: "Post not found" }, 404);

      if (method === "PUT") {
        const post = db.posts[postIndex];
        post.title = requestBody.title || post.title;
        post.preview = requestBody.preview || post.preview;
        post.body = requestBody.preview || post.body;
        post.visibility = requestBody.membersOnly === "true" || requestBody.membersOnly === true ? "members" : "public";
        post.status = requestBody.status || post.status;
        if (requestBody.removeImage === "true" || requestBody.removeImage === true) {
          post.image = null;
        } else if (requestBody.image && requestBody.image instanceof File) {
          post.image = URL.createObjectURL(requestBody.image);
        }
        saveDb(db);
        return jsonResponse(post);
      }
      if (method === "DELETE") {
        db.posts.splice(postIndex, 1);
        saveDb(db);
        return jsonResponse({ success: true });
      }
    }

    // 20. /dashboard/earnings
    if (path === "/dashboard/earnings" && method === "GET") {
      const myPayouts = db.payouts.filter(p => p.username.toLowerCase() === user.username.toLowerCase());
      return jsonResponse({
        total_earned: "$" + user.total_earned.toFixed(2),
        total_change: "+12%",
        net_earned: "$" + (user.total_earned * 0.9).toFixed(2),
        platform_fee_percent: 10,
        available_balance: "$" + user.balance.toFixed(2),
        total_payouts_sum: "$" + user.payouts_sum.toFixed(2),
        payouts: myPayouts,
        chart_data: [
          { month: "Jan", earnings: Math.round(user.total_earned * 0.1) },
          { month: "Feb", earnings: Math.round(user.total_earned * 0.2) },
          { month: "Mar", earnings: Math.round(user.total_earned * 0.4) },
          { month: "Apr", earnings: Math.round(user.total_earned * 0.5) },
          { month: "May", earnings: Math.round(user.total_earned * 0.7) },
          { month: "Jun", earnings: Math.round(user.total_earned * 0.9) },
          { month: "Jul", earnings: Math.round(user.total_earned) }
        ]
      });
    }

    // 21. /dashboard/memberships GET & POST
    if (path === "/dashboard/memberships") {
      if (method === "GET") {
        return jsonResponse(db.tiers.filter(t => t.username.toLowerCase() === user.username.toLowerCase()));
      }
      if (method === "POST") {
        const newTier = {
          id: db.tiers.length + 1,
          username: user.username,
          name: requestBody.name,
          price: Number(requestBody.price || 5),
          subscriber_count: 0,
          perks: requestBody.perks || []
        };
        db.tiers.push(newTier);
        saveDb(db);
        return jsonResponse(newTier, 201);
      }
    }

    // 22. /dashboard/memberships/:id PUT & DELETE
    match = matchPath(path, "/dashboard/memberships/:id");
    if (match) {
      const tierId = Number(match[0]);
      const tierIndex = db.tiers.findIndex(t => t.id === tierId && t.username.toLowerCase() === user.username.toLowerCase());
      if (tierIndex === -1) return jsonResponse({ error: "Tier not found" }, 404);

      if (method === "PUT") {
        const tier = db.tiers[tierIndex];
        tier.name = requestBody.name || tier.name;
        tier.price = Number(requestBody.price || tier.price);
        tier.perks = requestBody.perks || tier.perks;
        saveDb(db);
        return jsonResponse(tier);
      }
      if (method === "DELETE") {
        db.tiers.splice(tierIndex, 1);
        saveDb(db);
        return new Response(null, { status: 204 });
      }
    }

    // 23. /dashboard/payouts
    if (path === "/dashboard/payouts" && method === "POST") {
      const amount = Number(requestBody.amount);
      if (isNaN(amount) || amount > user.balance) {
        return jsonResponse({ error: "Insufficient balance or invalid amount" }, 400);
      }
      const creator = db.users.find(u => u.id === user.id);
      creator.balance = (creator.balance || 0) - amount;
      creator.payouts_sum = (creator.payouts_sum || 0) + amount;
      const newPayout = {
        id: db.payouts.length + 1,
        username: user.username,
        amount,
        method: requestBody.method || "Stripe",
        status: "Pending",
        created_at: new Date().toISOString()
      };
      db.payouts.push(newPayout);
      saveDb(db);
      return jsonResponse({ success: true, payout: newPayout });
    }

    // 24. /dashboard/settings GET
    if (path === "/dashboard/settings" && method === "GET") {
      return jsonResponse({
        profile: {
          creator_name: user.name,
          creator_bio: user.bio,
          creator_image: user.avatar_url,
          cover_image: user.cover_image,
          creator_category: user.category,
          creator_links: user.creator_links || []
        },
        stripe: {
          is_connected: user.stripe_connected
        },
        notifications: user.notifications || { email_supporter: true, email_post: true },
        goal: {
          title: user.goal_title || "",
          amount: user.goal_amount || 0
        }
      });
    }

    // 25. /dashboard/settings/profile PATCH
    if (path === "/dashboard/settings/profile" && method === "PATCH") {
      const creator = db.users.find(u => u.id === user.id);
      creator.name = requestBody.creator_name || creator.name;
      creator.bio = requestBody.creator_bio || creator.bio;
      creator.category = requestBody.creator_category || creator.category;
      creator.creator_links = requestBody.creator_links || creator.creator_links || [];
      saveDb(db);
      return jsonResponse({ success: true });
    }

    // 26. /dashboard/settings/avatar POST
    if (path === "/dashboard/settings/avatar" && method === "POST") {
      const creator = db.users.find(u => u.id === user.id);
      const file = requestBody.avatar;
      const avatarUrl = (file && file instanceof File)
        ? URL.createObjectURL(file)
        : creator.avatar_url;
      creator.avatar_url = avatarUrl;
      saveDb(db);
      return jsonResponse({ success: true, avatar_url: avatarUrl });
    }

    // 27. /dashboard/settings/notifications PATCH
    if (path === "/dashboard/settings/notifications" && method === "PATCH") {
      const creator = db.users.find(u => u.id === user.id);
      creator.notifications = {
        email_supporter: requestBody.email_supporter === true || requestBody.email_supporter === "true",
        email_post: requestBody.email_post === true || requestBody.email_post === "true"
      };
      saveDb(db);
      return jsonResponse({ success: true });
    }

    // 28. /dashboard/settings/goal PUT
    if (path === "/dashboard/settings/goal" && method === "PUT") {
      const creator = db.users.find(u => u.id === user.id);
      creator.goal_title = requestBody.title || "";
      creator.goal_amount = Number(requestBody.amount || 0);
      saveDb(db);
      return jsonResponse({ success: true });
    }

    // 29. /dashboard/settings/stripe/status GET
    if (path === "/dashboard/settings/stripe/status" && method === "GET") {
      return jsonResponse({ is_connected: user.stripe_connected });
    }

    // 30. /dashboard/settings/stripe/connect POST
    if (path === "/dashboard/settings/stripe/connect" && method === "POST") {
      const creator = db.users.find(u => u.id === user.id);
      creator.stripe_connected = true;
      saveDb(db);
      return jsonResponse({ url: "/dashboard" });
    }

    // 31. /dashboard/settings/email/request-change POST
    if (path === "/dashboard/settings/email/request-change" && method === "POST") {
      return jsonResponse({ success: true, message: "Code sent." });
    }

    // 32. /dashboard/settings/email/verify-change POST
    if (path === "/dashboard/settings/email/verify-change" && method === "POST") {
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: "Endpoint not simulated" }, 404);
  };
}

// ---------------------------------------------------------------------------
// Auth token helpers
// The JWT returned by /auth/login is persisted in localStorage so the session
// survives page reloads. Use these helpers everywhere instead of touching
// localStorage directly, so the storage key stays in one place.
// ---------------------------------------------------------------------------
const TOKEN_KEY = "brewme_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Decode the JWT payload (the middle segment) without verifying the signature.
// Returns null for a missing or malformed token. Used only to read the `exp`
// claim client-side so we can drop an obviously-expired token early — the
// backend remains the real authority.
export const getTokenPayload = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const payload = getTokenPayload();
  if (!payload) return false;
  // If the token carries an `exp` claim and it's in the past, the session has
  // expired — clear it and treat the user as logged out.
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    clearToken();
    return false;
  }
  return true;
};

// Authorization header for authenticated requests (empty object when no token).
export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// fetch() wrapper that attaches the bearer token and centralises expired-session
// handling: any 401 means the token is gone or rejected, so we log out locally
// and bounce to /login. Use this for all authenticated API calls.
export const apiFetch = async (path, options = {}) => {
  const headers = {
    ...authHeaders(),
    ...(options.headers || {}),
  };

  // Automatically set Content-Type to application/json if body is present and
  // it's not already set. Skip FormData — the browser must set the multipart
  // boundary itself, so we leave Content-Type unset for it.
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }

  return res;
};

// Get the authenticated user's profile information.
export const getProfile = async () => {
  const res = await apiFetch("/profile/");
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

// --- Dashboard Endpoints ---

// Get summary stats for the dashboard overview.
export const getDashboardStats = async () => {
  const res = await apiFetch("/dashboard/stats");
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch dashboard stats");
  }
  return res.json();
};

// Get the list of supporters for the authenticated creator.
// Uses /supporters-list (not /supporters): only that endpoint returns the raw
// `id`, real `support_replied`, and `creator_reply` fields the Supporters page
// needs to reply, filter, and render replies. /supporters is the thin feed.
export const getDashboardSupporters = async (limit = 20) => {
  const res = await apiFetch(`/dashboard/supporters-list?limit=${limit}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch dashboard supporters");
  }
  return res.json();
};

// Reply to a supporter message. `type` ("coffee" | "membership") selects which
// table the reply is stored in, since donations and memberships share id spaces.
export const replyToSupporter = async (
  supporterId,
  message,
  type = "coffee",
) => {
  const res = await apiFetch(
    `/dashboard/supporters/${supporterId}/reply?type=${type}`,
    {
      method: "POST",
      body: JSON.stringify({ message }),
    },
  );
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to send reply");
  }
  return res.json();
};

// Get the list of posts for the authenticated creator.
export const getDashboardPosts = async () => {
  const res = await apiFetch("/dashboard/posts");
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch posts");
  }
  return res.json();
};

// Create a new post. Accepts a FormData (title, preview, membersOnly,
// visibility, and an optional `image` file). Returns the created post.
export const createPost = async (formData) => {
  const res = await apiFetch("/dashboard/posts", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to create post");
  }
  return res.json();
};

// Update an existing post. Accepts a FormData (same fields as createPost, plus
// an optional `removeImage=true` to clear the current image). Returns the post.
export const updatePost = async (id, formData) => {
  const res = await apiFetch(`/dashboard/posts/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to update post");
  }
  return res.json();
};

// Delete a post by id.
export const deletePost = async (id) => {
  const res = await apiFetch(`/dashboard/posts/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to delete post");
  }
  return res.json();
};

// Get earnings data (totals, chart points, and payout history).
export const getDashboardEarnings = async () => {
  const res = await apiFetch("/dashboard/earnings");
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch earnings");
  }
  return res.json();
};

// Get membership tiers and subscriber counts.
export const getDashboardMemberships = async () => {
  try {
    const res = await apiFetch("/dashboard/memberships");
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return [
      {
        id: 1,
        name: "Supporter",
        price: 5,
        subscriber_count: 89,
        perks: ["Exclusive posts", "Supporter badge"],
      },
      {
        id: 2,
        name: "Gold Member",
        price: 15,
        subscriber_count: 34,
        perks: ["Monthly Q&A", "Early access"],
      },
    ];
  }
};

// Create a new membership tier.
export const createMembershipTier = async (tierData) => {
  try {
    const res = await apiFetch("/dashboard/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tierData),
    });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    // Return simulated success
    return {
      ...tierData,
      id: Math.floor(Math.random() * 1000),
      subscriber_count: 0,
    };
  }
};

// Request a payout. Takes { amount, method }.
export const requestPayout = async ({ amount, method }) => {
  const res = await apiFetch("/dashboard/payouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: Number(amount), method }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to request payout");
  }
  return res.json();
};

// Start the public checkout flow for a creator donation.
export const createDonationCheckout = async (username, donationData) => {
  const res = await fetch(`${API_BASE}/creators/${username}/donations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donationData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || error.error || "Failed to start checkout");
  }
  return res.json();
};

// Start the public checkout flow for a creator membership subscription.
export const createMembershipCheckout = async (username, membershipData) => {
  const res = await apiFetch(`/creators/${username}/memberships`, {
    method: "POST",
    body: JSON.stringify(membershipData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || error.error || "Failed to start membership checkout");
  }
  return res.json();
};

// --- Public Endpoints ---

// Get posts for a specific creator.
export const getCreatorPosts = async (username, limit = 10) => {
  const res = await apiFetch(`/creators/${username}/posts?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch creator posts");
  return res.json();
};

// Tell the backend to invalidate the session, then clear the local token.
// We clear locally even if the network call fails, so logout always "works".
export const logout = async () => {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { ...authHeaders() },
    });
  } catch {
    // Ignore network errors — we still log out on the client.
  } finally {
    clearToken();
  }
};

// Get the list of all available creator categories.
export const getCategories = async () => {
  const res = await fetch(`${API_BASE}/category/`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

// Get the dashboard settings bootstrap payload.
export const getDashboardSettings = async () => {
  const res = await apiFetch("/dashboard/settings");
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch dashboard settings");
  }
  return res.json();
};

// Update the creator profile fields shown on Settings.
export const updateDashboardProfile = async (profileData) => {
  const res = await apiFetch("/dashboard/settings/profile", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save profile settings");
  }
  return res.json();
};

// Upload a new profile avatar and return the stored URL.
export const updateDashboardAvatar = async (avatarFile) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  const res = await apiFetch("/dashboard/settings/avatar", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to upload avatar");
  }
  return res.json();
};

// Update notification preferences.
export const updateDashboardNotifications = async (notifications) => {
  const res = await apiFetch("/dashboard/settings/notifications", {
    method: "PATCH",
    body: JSON.stringify(notifications),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save notification settings");
  }
  return res.json();
};

// Update the active funding goal.
export const updateDashboardGoal = async (goal) => {
  const res = await apiFetch("/dashboard/settings/goal", {
    method: "PUT",
    body: JSON.stringify(goal),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save goal settings");
  }
  return res.json();
};

// Get the connected Stripe payout account summary.
export const getDashboardStripeStatus = async () => {
  const res = await apiFetch("/dashboard/settings/stripe/status");
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch Stripe status");
  }
  return res.json();
};

// Create or refresh the creator's Stripe Express onboarding / management link.
export const createStripeConnectLink = async () => {
  const res = await apiFetch("/dashboard/settings/stripe/connect", {
    method: "POST",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to open Stripe onboarding");
  }
  return res.json();
};

// Update a membership tier.
export const updateMembershipTier = async (tierId, tierData) => {
  const res = await apiFetch(`/dashboard/memberships/${tierId}`, {
    method: "PUT",
    body: JSON.stringify(tierData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update tier");
  }
  return res.json();
};

// Archive a membership tier.
export const deleteMembershipTier = async (tierId) => {
  const res = await apiFetch(`/dashboard/memberships/${tierId}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to archive tier");
  }
  return true;
};

// Request an email change verification code.
export const requestEmailChange = async (newEmail) => {
  const res = await apiFetch("/dashboard/settings/email/request-change", {
    method: "POST",
    body: JSON.stringify({ new_email: newEmail }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Failed to request email change");
  }
  return res.json();
};

// Verify an email change code.
export const verifyEmailChange = async (code) => {
  const res = await apiFetch("/dashboard/settings/email/verify-change", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Failed to verify email change");
  }
  return res.json();
};

// Get every creator for the Explore/Discover directory.
export const getDiscoverCreators = async () => {
  const res = await fetch(`${API_BASE}/discover`);
  if (!res.ok) throw new Error("Failed to fetch creators");
  return res.json();
};

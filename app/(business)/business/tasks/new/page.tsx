"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BusinessSidebar from "@/components/BusinessSidebar";
import BusinessBottomNav from "@/components/BusinessBottomNav";

type CampaignCategory = {
  id: string;
  title: string;
  description: string;
  bestFor: string;
  icon: string;
  accent: string;
  category: string;
  missionType: "engagement" | "participation" | "premium";
};

type Package = {
  id: string;
  name: string;
  reach: string;
  description: string;
  reward: number;
  contributors: number;
  duration: string;
};

type CampaignBundle = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  bestFor: string[];
  contentTypes: string[];
  platforms: string[];
  actions: string[];
  verification: string[];
  accent: string;
  icon: string;
};

type CategoryFlow = {
  id: string;
  builderIntro: string;
  contentHeadline: string;
  contentHelp: string;
  contentTypes: string[];
  goalsHeadline: string;
  goals: string[];
  uploadRequirements: Record<string, string[]>;
  linkLabel: string;
  linkPlaceholder: string;
  captionLabel: string;
  captionPlaceholder: string;
  bundlesHeadline: string;
  targetHeadline: string;
  targetHelp: string;
  interests: string[];
  levels: string[];
  packages: Package[];
  launchHeadline: string;
  launchSummary: string;
  launchCta: string;
  previewLabel: string;
  defaultContentType: string;
  defaultGoal: string;
  defaultTitle: string;
  defaultInterests: string[];
  defaultLevels: string[];
  defaultBundleId: string;
};

type PlatformMeta = {
  icon: string;
  recommendedFor: string;
  visibility: string;
  audience: string;
};

const campaignCategories: CampaignCategory[] = [
  { id: "content", title: "Content Distribution", description: "Spread flyers, videos, announcements, and promotional content across social channels.", bestFor: "WhatsApp status, Facebook reposts, Instagram stories, Telegram, X, YouTube Shorts, TikTok", icon: "/icon-human-distribution.svg", accent: "#4a9eff", category: "Content Distribution", missionType: "engagement" },
  { id: "music", title: "Music Promotion", description: "Launch dedicated entertainment campaigns for artists, songs, sounds, and releases.", bestFor: "Music teasers, TikTok sounds, album flyers, song reviews, dance or reaction challenges", icon: "/icon-music.svg", accent: "#F5A623", category: "Music Promotion", missionType: "engagement" },
  { id: "business", title: "Business Awareness", description: "Build visibility for SMEs, local stores, products, services, and offers.", bestFor: "Product promotion, store awareness, promo campaigns, service awareness, local distribution", icon: "/icon-local-business.svg", accent: "#1AEF22", category: "Business Awareness", missionType: "engagement" },
  { id: "creator", title: "Creator Campaigns", description: "Amplify influencers, skit makers, streamers, creators, and personal brands.", bestFor: "Creator reposts, engagement support, livestream awareness, page awareness, collaborations", icon: "/icon-creator.svg", accent: "#c084fc", category: "Creator Campaigns", missionType: "engagement" },
  { id: "apps", title: "App Testing & Reviews", description: "Get real participants to download, test, review, and report app experiences.", bestFor: "App downloads, onboarding tests, bug reports, feature testing, review submissions", icon: "/icon-app-testing.svg", accent: "#14b8a6", category: "App Testing", missionType: "participation" },
  { id: "referral", title: "Referral Missions", description: "Run performance-based growth campaigns tied to signups, invites, or ambassadors.", bestFor: "Invite campaigns, signup referrals, ambassador programs, user acquisition campaigns", icon: "/icon-target.svg", accent: "#f87171", category: "Referral Missions", missionType: "premium" },
  { id: "surveys", title: "Surveys & Feedback", description: "Collect market insight, customer opinions, product feedback, and structured responses.", bestFor: "Surveys, polls, feedback forms, customer opinion missions, product experience reviews", icon: "/icon-survey.svg", accent: "#fb7185", category: "Surveys & Feedback", missionType: "participation" },
  { id: "event", title: "Event Promotion", description: "Drive awareness for events, programs, campus activities, and local gatherings.", bestFor: "Church programs, concerts, conferences, campus events, local gathering awareness", icon: "/icon-events.svg", accent: "#f97316", category: "Event Promotion", missionType: "engagement" },
  { id: "community", title: "Community Growth", description: "Grow active brand communities and invite relevant people into social spaces.", bestFor: "Telegram joins, WhatsApp community joins, Discord joins, Facebook group participation", icon: "/icon-community.svg", accent: "#22c55e", category: "Community Growth", missionType: "participation" },
  { id: "video", title: "Video Engagement", description: "Improve visibility for short-form and long-form video content through real participation.", bestFor: "Watch campaigns, save campaigns, repost video campaigns, short-form content engagement", icon: "/icon-content.svg", accent: "#e879f9", category: "Video Engagement", missionType: "engagement" },
  { id: "ambassador", title: "Brand Ambassador Missions", description: "Create longer-term contributor partnerships for recurring brand representation.", bestFor: "Recurring promotions, monthly campaigns, niche representation, campus ambassador activities", icon: "/icon-verified.svg", accent: "#60a5fa", category: "Brand Ambassador Missions", missionType: "premium" },
  { id: "digital", title: "AI & Digital Work", description: "Prepare scalable digital work campaigns beyond social growth and awareness.", bestFor: "AI training tasks, image labeling, transcription, moderation, simple online work", icon: "/icon-analytics.svg", accent: "#38bdf8", category: "AI & Digital Work", missionType: "participation" },
  { id: "local", title: "Local Discovery Missions", description: "Activate geo-targeted participation for physical locations and local discovery.", bestFor: "Store visits, local awareness, QR scan campaigns, neighborhood promotion, physical-to-digital activation", icon: "/icon-grassroots.svg", accent: "#10b981", category: "Local Discovery Missions", missionType: "participation" },
  { id: "trend", title: "Trend Missions", description: "Launch time-sensitive campaigns around viral sounds, hashtags, memes, and challenges.", bestFor: "Trending sound participation, hashtag waves, viral challenge support, meme participation", icon: "/icon-fire.svg", accent: "#fb7185", category: "Trend Missions", missionType: "engagement" },
  { id: "premium", title: "Premium Missions", description: "Reserve higher-quality, higher-paying work for verified contributors.", bestFor: "Influencer-level participation, UGC creation, testimonial videos, premium reviews, creator collaborations", icon: "/icon-trophy.svg", accent: "#facc15", category: "Premium Missions", missionType: "premium" },
];

const goals = [
  "Increase visibility",
  "Spread awareness",
  "Promote a launch",
  "Grow a community",
  "Get feedback",
  "Boost content reach",
  "Drive app downloads",
  "Encourage referrals",
  "Promote an event",
  "Generate conversations",
];

const defaultContentTypes = ["Flyer", "Video", "Audio", "Product image", "Link"];
const actionOptions = [
  "Post flyer to WhatsApp status",
  "Post song artwork to WhatsApp status",
  "Post product flyer to WhatsApp status",
  "Post to Facebook story",
  "Post to Instagram story",
  "Share to WhatsApp groups",
  "Repost social media post",
  "Share announcement banner",
  "Share product/store link",
  "Share in relevant groups",
  "Mention business handle",
  "Encourage page visits",
  "Add call-to-action text",
  "Repost TikTok video",
  "Share Instagram Reel",
  "Upload or repost Facebook Reel",
  "Repost video",
  "Use provided hashtags",
  "Add provided caption",
  "Tag campaign account",
  "Use campaign sound",
  "Use provided sound",
  "Upload short-form video",
  "Add required hashtag",
  "Tag artist page",
  "Include streaming link",
  "Stream song from provided link",
  "Repost creator video",
  "Tag creator page",
  "Encourage comments",
  "Join creator community",
  "Stay active for required duration",
  "Share invite link",
  "Invite relevant users",
  "Share livestream reminder",
  "Repost on X/Twitter",
  "Share YouTube Short",
  "Join Telegram community",
  "Join WhatsApp community",
  "Invite friends",
  "Download app",
  "Test onboarding",
  "Submit feedback",
  "Create test account",
  "Complete onboarding flow",
  "Test specific feature",
  "Record issues encountered",
  "Submit screenshots or screen recording",
  "Explain reproduction steps",
  "Complete assigned user journey",
  "Use the product before reviewing",
  "Rate the product experience",
  "Submit honest experience-based review",
  "Suggest improvements",
  "Report confusing steps",
  "Upload testimonial video",
  "Share flyer in groups",
  "Use provided caption",
  "Keep post active for 24 hours",
];
const interestOptions = ["Music", "Business", "Entertainment", "Tech", "Students", "Fashion", "Gaming", "Lifestyle", "Local Communities"];
const platformOptions = ["WhatsApp Status", "Facebook Story", "Instagram Story", "Facebook Groups", "Telegram Channels", "TikTok", "Instagram Reels", "Facebook Reels", "X/Twitter repost", "Facebook repost", "Instagram story share", "Telegram Groups", "X/Twitter", "YouTube Shorts"];
const levelOptions = ["All Contributors", "Verified Contributors", "Premium Promoters", "Community Influencers"];
const stateOptions = ["Lagos", "Abuja (FCT)", "Kano", "Rivers", "Oyo", "Kaduna", "Anambra", "Delta", "Edo", "Ogun", "Enugu", "Imo"];
const cityOptions = ["Lagos Mainland", "Lekki", "Ikeja", "Abuja Central", "Port Harcourt", "Ibadan", "Kano City", "Benin City"];
const campusOptions = ["University of Lagos", "University of Ibadan", "Covenant University", "Ahmadu Bello University", "University of Nigeria", "Yaba College of Technology"];

const platformMeta: Record<string, PlatformMeta> = {
  "WhatsApp Status": { icon: "WS", recommendedFor: "Flyers, announcements", visibility: "High local visibility", audience: "Contacts and nearby communities" },
  "Facebook Story": { icon: "FS", recommendedFor: "Flyers, launches", visibility: "Strong social visibility", audience: "Friends and page followers" },
  "Instagram Story": { icon: "IS", recommendedFor: "Flyers, creator content", visibility: "Fast visual exposure", audience: "Lifestyle and social audiences" },
  "Facebook Groups": { icon: "FG", recommendedFor: "Community notices", visibility: "High group reach", audience: "Interest and local groups" },
  "Telegram Channels": { icon: "TC", recommendedFor: "Announcements", visibility: "Community broadcast", audience: "Group and channel members" },
  TikTok: { icon: "TT", recommendedFor: "Videos, viral clips", visibility: "High viral potential", audience: "Short-form viewers" },
  "Instagram Reels": { icon: "IR", recommendedFor: "Promo videos", visibility: "Strong discovery", audience: "Visual and creator audiences" },
  "Facebook Reels": { icon: "FR", recommendedFor: "Promo videos", visibility: "Broad video reach", audience: "Facebook video viewers" },
  "X/Twitter repost": { icon: "XR", recommendedFor: "Posts, announcements", visibility: "Fast public spread", audience: "Public conversation" },
  "Facebook repost": { icon: "FP", recommendedFor: "Social posts", visibility: "Feed exposure", audience: "Friends and followers" },
  "Instagram story share": { icon: "SS", recommendedFor: "Social posts", visibility: "Quick visual lift", audience: "Story viewers" },
  "Telegram Groups": { icon: "TG", recommendedFor: "Groups, communities", visibility: "Focused community reach", audience: "Community members" },
  "X/Twitter": { icon: "X", recommendedFor: "Links, updates", visibility: "Public feed reach", audience: "Public audiences" },
  "YouTube Shorts": { icon: "YS", recommendedFor: "Short video", visibility: "Video discovery", audience: "Shorts viewers" },
  Android: { icon: "AN", recommendedFor: "Android app testing", visibility: "Mobile device access", audience: "Android users" },
  "iPhone/iOS": { icon: "iOS", recommendedFor: "iOS app testing", visibility: "Apple device access", audience: "iPhone users" },
  "Desktop Users": { icon: "DT", recommendedFor: "Web product testing", visibility: "Desktop browser access", audience: "Laptop and desktop users" },
  "Tablet Users": { icon: "TB", recommendedFor: "Tablet layout testing", visibility: "Tablet access", audience: "Tablet users" },
  "Web Browser": { icon: "WB", recommendedFor: "Website testing", visibility: "Browser access", audience: "Web users" },
  "App Store": { icon: "AS", recommendedFor: "iOS install flow", visibility: "Store listing access", audience: "iOS testers" },
  "Play Store": { icon: "PS", recommendedFor: "Android install flow", visibility: "Store listing access", audience: "Android testers" },
};

const campaignBundles: CampaignBundle[] = [
  {
    id: "content-flyer-status",
    name: "Flyer Story & Status Distribution",
    shortName: "Flyer Status Push",
    description: "Distribute flyers through WhatsApp Status, Facebook Story, Instagram Story, and nearby social circles.",
    bestFor: ["Business awareness", "Events", "Church programs", "Product promos"],
    contentTypes: ["Flyer Promotion", "Announcement Campaign"],
    platforms: ["WhatsApp Status", "Facebook Story", "Instagram Story"],
    actions: ["Post flyer to WhatsApp status", "Post to Facebook story", "Post to Instagram story", "Use provided caption", "Keep post active for 24 hours"],
    verification: ["Screenshot proof", "Timestamp check", "24 hour duration"],
    accent: "#F5A623",
    icon: "/icon-human-distribution.svg",
  },
  {
    id: "content-video-distribution",
    name: "Video Distribution Bundle",
    shortName: "Video Distribution",
    description: "Push promo videos and awareness clips through short-form video platforms and status channels.",
    bestFor: ["Promo videos", "Short-form content", "Creator clips", "Awareness campaigns"],
    contentTypes: ["Video Distribution"],
    platforms: ["TikTok", "Instagram Reels", "Facebook Reels", "WhatsApp Status"],
    actions: ["Repost video", "Use provided hashtags", "Add provided caption", "Tag campaign account"],
    verification: ["Repost link", "Caption check", "Hashtag check", "Visibility check"],
    accent: "#F5A623",
    icon: "/icon-content.svg",
  },
  {
    id: "content-social-post",
    name: "Social Post Distribution Bundle",
    shortName: "Social Post Push",
    description: "Amplify existing posts through reposts, story shares, and public social distribution.",
    bestFor: ["Engagement campaigns", "Creator posts", "Public announcements"],
    contentTypes: ["Social Media Post"],
    platforms: ["X/Twitter repost", "Facebook repost", "Instagram story share"],
    actions: ["Repost social media post", "Use provided caption", "Tag campaign account", "Encourage comments"],
    verification: ["Repost link", "Story screenshot", "Caption check"],
    accent: "#F5A623",
    icon: "/icon-social-media.svg",
  },
  {
    id: "content-community-announcement",
    name: "Community Announcement Distribution",
    shortName: "Community Notice",
    description: "Spread announcements, launches, updates, and notices through relevant community spaces.",
    bestFor: ["Launches", "Updates", "Public awareness", "Community notices"],
    contentTypes: ["Announcement Campaign", "Multi-Content Campaign"],
    platforms: ["Facebook Groups", "Telegram Channels", "WhatsApp Status"],
    actions: ["Share announcement banner", "Use provided caption", "Share to WhatsApp groups", "Share in relevant groups"],
    verification: ["Group screenshot", "Timestamp check", "Community relevance"],
    accent: "#F5A623",
    icon: "/icon-community.svg",
  },
  {
    id: "content-traffic-push",
    name: "Link Traffic Distribution Bundle",
    shortName: "Traffic Distribution",
    description: "Distribute content while guiding audiences toward a website, profile, landing page, or streaming platform.",
    bestFor: ["Website traffic", "Profile visits", "Landing pages", "Streaming platforms"],
    contentTypes: ["Flyer Promotion", "Social Media Post", "Multi-Content Campaign"],
    platforms: ["WhatsApp Status", "X/Twitter", "Facebook Groups", "Instagram Story"],
    actions: ["Share product/store link", "Use provided caption", "Encourage page visits", "Add call-to-action text"],
    verification: ["Shared link proof", "Screenshot proof", "CTA check"],
    accent: "#F5A623",
    icon: "/icon-target.svg",
  },
  {
    id: "music-story-status",
    name: "Story & Status Music Push",
    shortName: "Music Status Push",
    description: "Push cover art, snippets, and artist announcements through temporary story/status channels.",
    bestFor: ["Song awareness", "Local buzz", "Artist visibility", "Quick distribution"],
    contentTypes: ["Song Release", "Artist Awareness Campaign", "Album / EP Launch"],
    platforms: ["WhatsApp Status", "Facebook Story", "Instagram Story"],
    actions: ["Post song artwork to WhatsApp status", "Post to Facebook story", "Post to Instagram story", "Use provided caption", "Include streaming link", "Keep post active for 24 hours"],
    verification: ["Screenshot proof", "Timestamp check", "24 hour duration"],
    accent: "#F5A623",
    icon: "/icon-music.svg",
  },
  {
    id: "music-short-video",
    name: "Short-Form Video Boost",
    shortName: "Video Boost",
    description: "Drive viral momentum for sounds, snippets, teasers, and music-video clips.",
    bestFor: ["Viral momentum", "Trend creation", "Sound promotion", "Teaser campaigns"],
    contentTypes: ["Song Snippet / Teaser", "TikTok Sound Campaign", "Music Video"],
    platforms: ["TikTok", "Instagram Reels", "Facebook Reels"],
    actions: ["Use provided sound", "Upload short-form video", "Add required hashtag", "Tag artist page", "Use provided caption"],
    verification: ["Video link", "Caption check", "Hashtag check", "Sound usage check"],
    accent: "#F5A623",
    icon: "/icon-fire.svg",
  },
  {
    id: "music-streaming",
    name: "Streaming Awareness Bundle",
    shortName: "Streaming Push",
    description: "Route contributors toward streaming links and release discovery.",
    bestFor: ["Increasing streams", "Listener traffic", "Release promotion"],
    contentTypes: ["Song Release", "Streaming Campaign", "Album / EP Launch"],
    platforms: ["Audiomack", "Spotify", "Boomplay", "Apple Music"],
    actions: ["Stream song from provided link", "Include streaming link", "Use provided caption", "Share flyer in groups"],
    verification: ["Streaming screenshot", "Link proof", "Platform check"],
    accent: "#F5A623",
    icon: "/icon-content.svg",
  },
  {
    id: "music-fan-engagement",
    name: "Fan Engagement Bundle",
    shortName: "Fan Activation",
    description: "Activate music communities, artist mentions, and fanbase interaction.",
    bestFor: ["Artist fanbase growth", "Community interaction", "Fan activation"],
    contentTypes: ["Artist Awareness Campaign", "Album / EP Launch"],
    platforms: ["Telegram Groups", "WhatsApp Communities", "Instagram", "TikTok"],
    actions: ["Join Telegram community", "Join WhatsApp community", "Tag artist page", "Submit feedback", "Share in relevant groups"],
    verification: ["Membership validation", "Interaction proof", "Screenshot proof"],
    accent: "#F5A623",
    icon: "/icon-community.svg",
  },
  {
    id: "creator-story-status",
    name: "Story & Status Creator Push",
    shortName: "Creator Status Push",
    description: "Quick visibility for creator posts, livestream flyers, and personal brand announcements.",
    bestFor: ["Creator visibility", "Livestream awareness", "Quick content exposure"],
    contentTypes: ["Content Awareness Campaign", "Livestream Promotion", "Personal Brand Awareness"],
    platforms: ["WhatsApp Status", "Instagram Story", "Facebook Story"],
    actions: ["Post to Instagram story", "Post to Facebook story", "Post flyer to WhatsApp status", "Use provided caption", "Tag creator page"],
    verification: ["Screenshot proof", "Timestamp check", "Story visibility"],
    accent: "#F5A623",
    icon: "/icon-creator.svg",
  },
  {
    id: "creator-short-form",
    name: "Short-Form Visibility Boost",
    shortName: "Short-Form Boost",
    description: "Amplify Reels, TikToks, clips, and creator videos for algorithm momentum.",
    bestFor: ["Viral content", "Creator clips", "Algorithm momentum"],
    contentTypes: ["Short-Form Video Promotion"],
    platforms: ["TikTok", "Instagram Reels", "Facebook Reels"],
    actions: ["Repost creator video", "Use provided caption", "Add required hashtag", "Tag creator page", "Encourage comments"],
    verification: ["Repost link", "Caption check", "Hashtag check", "Visibility check"],
    accent: "#F5A623",
    icon: "/icon-fire.svg",
  },
  {
    id: "creator-community",
    name: "Community Growth Bundle",
    shortName: "Community Growth",
    description: "Grow fan spaces, broadcast groups, and creator communities with retention checks.",
    bestFor: ["Fanbase growth", "Audience retention", "Creator community building"],
    contentTypes: ["Community Growth Campaign"],
    platforms: ["Telegram", "WhatsApp Communities", "Discord"],
    actions: ["Join creator community", "Stay active for required duration", "Share invite link", "Invite relevant users"],
    verification: ["Membership validation", "Retention duration", "Participation check"],
    accent: "#F5A623",
    icon: "/icon-community.svg",
  },
  {
    id: "creator-engagement",
    name: "Creator Engagement Boost",
    shortName: "Engagement Boost",
    description: "Support content visibility through real reactions, comments, reposts, and social discovery.",
    bestFor: ["Engagement activity", "Comment momentum", "Content visibility"],
    contentTypes: ["Content Awareness Campaign", "Personal Brand Awareness", "Podcast / Long-Form Content Promotion"],
    platforms: ["TikTok", "Instagram", "X/Twitter", "Facebook"],
    actions: ["Use provided caption", "Tag creator page", "Encourage comments", "Repost on X/Twitter"],
    verification: ["Engagement screenshot", "Comment proof", "Repost link"],
    accent: "#F5A623",
    icon: "/icon-social-media.svg",
  },
  {
    id: "creator-livestream",
    name: "Livestream Awareness Bundle",
    shortName: "Livestream Push",
    description: "Drive reminders and attendance for live sessions across story and community channels.",
    bestFor: ["Live session awareness", "Viewer reminders", "Stream attendance"],
    contentTypes: ["Livestream Promotion"],
    platforms: ["WhatsApp Status", "Telegram Groups", "Instagram Story", "Facebook Story"],
    actions: ["Share livestream reminder", "Use provided caption", "Post to Instagram story", "Post to Facebook story", "Join Telegram community"],
    verification: ["Reminder screenshot", "Timestamp check", "Community proof"],
    accent: "#F5A623",
    icon: "/icon-events.svg",
  },
  {
    id: "business-story-status",
    name: "Story & Status Awareness Bundle",
    shortName: "Awareness Push",
    description: "Simple local visibility through WhatsApp Status, Facebook Story, and Instagram Story.",
    bestFor: ["Local awareness", "Promo visibility", "Event awareness", "Product promotion"],
    contentTypes: ["Product Promotion", "Service Awareness", "Offer / Discount Campaign", "Event Awareness"],
    platforms: ["WhatsApp Status", "Facebook Story", "Instagram Story"],
    actions: ["Post product flyer to WhatsApp status", "Post to Facebook story", "Post to Instagram story", "Use provided caption", "Keep post active for 24 hours"],
    verification: ["Screenshot proof", "Timestamp check", "24 hour duration"],
    accent: "#F5A623",
    icon: "/icon-local-business.svg",
  },
  {
    id: "business-social-feed",
    name: "Social Feed Distribution Bundle",
    shortName: "Feed Distribution",
    description: "Longer-lasting exposure for product posts, announcements, and business updates.",
    bestFor: ["Product visibility", "Announcements", "Long-term exposure"],
    contentTypes: ["Product Promotion", "Store / Brand Awareness", "Multi-Promotion Campaign"],
    platforms: ["Facebook Feed", "X/Twitter", "Instagram Feed"],
    actions: ["Use provided caption", "Mention business handle", "Share product/store link", "Repost on X/Twitter"],
    verification: ["Post link", "Caption check", "Screenshot proof"],
    accent: "#F5A623",
    icon: "/icon-social-media.svg",
  },
  {
    id: "business-short-form",
    name: "Short-Form Business Visibility Bundle",
    shortName: "Business Reels",
    description: "Showcase promos, restaurants, fashion, products, and visual offers through short video.",
    bestFor: ["Promo videos", "Restaurant visuals", "Fashion showcases", "Lifestyle branding"],
    contentTypes: ["Product Promotion", "Offer / Discount Campaign", "Store / Brand Awareness"],
    platforms: ["TikTok", "Instagram Reels", "Facebook Reels"],
    actions: ["Repost TikTok video", "Share Instagram Reel", "Upload or repost Facebook Reel", "Use provided caption"],
    verification: ["Repost link", "Caption check", "Visibility check"],
    accent: "#F5A623",
    icon: "/icon-content.svg",
  },
  {
    id: "business-community",
    name: "Community Distribution Bundle",
    shortName: "Community Blast",
    description: "Distribute offers and awareness in relevant local groups and communities.",
    bestFor: ["Local community reach", "Neighborhood awareness", "Event promotion"],
    contentTypes: ["Event Awareness", "Offer / Discount Campaign", "Service Awareness"],
    platforms: ["WhatsApp Groups", "Telegram Communities", "Facebook Groups"],
    actions: ["Share in relevant groups", "Use provided caption", "Mention business handle", "Share product/store link"],
    verification: ["Group screenshot", "Timestamp check", "Community relevance"],
    accent: "#F5A623",
    icon: "/icon-community.svg",
  },
  {
    id: "business-traffic",
    name: "Traffic Push Bundle",
    shortName: "Traffic Push",
    description: "Send attention toward websites, online stores, booking pages, and catalog links.",
    bestFor: ["Website visits", "Ecommerce traffic", "Booking pages", "Landing pages"],
    contentTypes: ["Website / Online Store Traffic", "Product Promotion"],
    platforms: ["Facebook", "X/Twitter", "WhatsApp Status", "Instagram Bio Traffic"],
    actions: ["Share product/store link", "Use provided caption", "Encourage page visits", "Add call-to-action text"],
    verification: ["Shared link proof", "Caption check", "Screenshot proof"],
    accent: "#F5A623",
    icon: "/icon-target.svg",
  },
  {
    id: "apps-quick-onboarding",
    name: "Quick Onboarding Test Bundle",
    shortName: "Quick Onboarding Test",
    description: "Guide real users through install, account creation, onboarding, and first-impression feedback.",
    bestFor: ["Signup testing", "First-time user experience", "Onboarding validation"],
    contentTypes: ["App Download & Onboarding", "Multi-Step Testing Campaign"],
    platforms: ["Android", "iPhone/iOS", "Play Store", "App Store"],
    actions: ["Download app", "Create test account", "Complete onboarding flow", "Submit feedback", "Report confusing steps"],
    verification: ["Install screenshot", "Account/onboarding proof", "Structured feedback"],
    accent: "#14b8a6",
    icon: "/icon-app-testing.svg",
  },
  {
    id: "apps-user-feedback",
    name: "User Feedback Bundle",
    shortName: "User Feedback",
    description: "Collect structured product opinions, experience ratings, and improvement suggestions.",
    bestFor: ["Customer opinions", "Experience reviews", "Usability feedback", "Market validation"],
    contentTypes: ["User Feedback Campaign", "Website Testing"],
    platforms: ["Android", "iPhone/iOS", "Desktop Users", "Web Browser"],
    actions: ["Complete assigned user journey", "Submit feedback", "Rate the product experience", "Suggest improvements"],
    verification: ["Feedback response", "Experience rating", "Usage proof"],
    accent: "#14b8a6",
    icon: "/icon-survey.svg",
  },
  {
    id: "apps-feature-validation",
    name: "Feature Validation Bundle",
    shortName: "Feature Validation",
    description: "Send testers through a guided feature flow with issue notes and proof of interaction.",
    bestFor: ["New feature releases", "Payment systems", "Workflow testing", "Functionality checks"],
    contentTypes: ["Feature Testing", "Website Testing"],
    platforms: ["Android", "iPhone/iOS", "Desktop Users", "Web Browser"],
    actions: ["Test specific feature", "Complete assigned user journey", "Record issues encountered", "Submit screenshots or screen recording"],
    verification: ["Feature interaction proof", "Issue notes", "Screenshot/video proof"],
    accent: "#14b8a6",
    icon: "/icon-target.svg",
  },
  {
    id: "apps-review-trust",
    name: "Review & Trust Bundle",
    shortName: "Review & Trust",
    description: "Gather honest experience-based reviews and testimonials after real product usage.",
    bestFor: ["Authentic user reviews", "Trust-building campaigns", "Experience ratings"],
    contentTypes: ["Review & Rating Campaign", "User Feedback Campaign"],
    platforms: ["Play Store", "App Store", "Web Browser", "Android", "iPhone/iOS"],
    actions: ["Use the product before reviewing", "Rate the product experience", "Submit honest experience-based review", "Submit feedback"],
    verification: ["Experience proof", "Review screenshot or link", "Feedback quality check"],
    accent: "#14b8a6",
    icon: "/icon-verified.svg",
  },
  {
    id: "apps-deep-testing",
    name: "Deep Testing Bundle",
    shortName: "Deep Testing",
    description: "Run a multi-step user journey test with detailed reporting and bug reproduction notes.",
    bestFor: ["Advanced testing", "Bug hunting", "Complete user journey analysis", "Beta testing"],
    contentTypes: ["Bug Reporting Campaign", "Multi-Step Testing Campaign", "Feature Testing"],
    platforms: ["Android", "iPhone/iOS", "Desktop Users", "Tablet Users", "Web Browser"],
    actions: ["Complete assigned user journey", "Test specific feature", "Record issues encountered", "Explain reproduction steps", "Submit screenshots or screen recording"],
    verification: ["Detailed report", "Reproduction steps", "Screenshot/video proof"],
    accent: "#14b8a6",
    icon: "/icon-analytics.svg",
  },
  {
    id: "story-status",
    name: "Story & Status Distribution Bundle",
    shortName: "Story & Status",
    description: "Temporary awareness posts across WhatsApp Status, Facebook Story, and Instagram Story.",
    bestFor: ["Flyer", "Product image", "Event announcement"],
    contentTypes: ["Flyer", "Product image"],
    platforms: ["WhatsApp Status", "Facebook Story", "Instagram Story"],
    actions: ["Post flyer to WhatsApp status", "Post to Facebook story", "Post to Instagram story", "Use provided caption", "Keep post active for 24 hours"],
    verification: ["Screenshot proof", "Timestamp check", "24 hour duration"],
    accent: "#F5A623",
    icon: "/icon-human-distribution.svg",
  },
  {
    id: "video-distribution",
    name: "Short-Form Video Distribution Bundle",
    shortName: "Video Boost",
    description: "Push short videos through TikTok, Instagram Reels, Facebook Reels, and Shorts-style channels.",
    bestFor: ["Short video", "Music teaser", "Creator clip"],
    contentTypes: ["Video"],
    platforms: ["TikTok", "Instagram Reels", "Facebook Reels", "YouTube Shorts"],
    actions: ["Repost TikTok video", "Share Instagram Reel", "Upload or repost Facebook Reel", "Share YouTube Short", "Use provided caption"],
    verification: ["Repost link", "Caption check", "Hashtag check", "Visibility check"],
    accent: "#F5A623",
    icon: "/icon-content.svg",
  },
  {
    id: "community-growth",
    name: "Community Growth Bundle",
    shortName: "Community Growth",
    description: "Route contributors into brand communities with proof and retention checks.",
    bestFor: ["Telegram", "WhatsApp communities", "Groups"],
    contentTypes: ["Link"],
    platforms: ["Telegram Groups", "WhatsApp Status"],
    actions: ["Join Telegram community", "Join WhatsApp community", "Invite friends", "Submit feedback"],
    verification: ["Membership validation", "Retention duration", "Participation check"],
    accent: "#F5A623",
    icon: "/icon-community.svg",
  },
  {
    id: "guided-engagement",
    name: "Guided Engagement Bundle",
    shortName: "Engagement",
    description: "A flexible campaign pack for links, feedback, app tests, reviews, and broad participation.",
    bestFor: ["App tests", "Surveys", "Feedback", "Links"],
    contentTypes: ["Audio", "Link"],
    platforms: ["X/Twitter", "Telegram Groups", "YouTube Shorts"],
    actions: ["Submit feedback", "Use provided caption", "Repost on X/Twitter"],
    verification: ["Text proof", "Screenshot proof", "Manual review"],
    accent: "#F5A623",
    icon: "/icon-target.svg",
  },
];

const packages: Package[] = [
  { id: "starter", name: "Starter Reach", reach: "Up to 100 contributors", description: "A clean test launch for local visibility.", reward: 1200, contributors: 100, duration: "3 days" },
  { id: "growth", name: "Growth Reach", reach: "Up to 500 contributors", description: "Balanced reach for offers, launches, and communities.", reward: 1500, contributors: 500, duration: "7 days" },
  { id: "viral", name: "Viral Push", reach: "Large-scale awareness", description: "Higher reward and pacing for broad participation.", reward: 2000, contributors: 1200, duration: "14 days" },
];

const musicPackages: Package[] = [
  { id: "starter-buzz", name: "Starter Buzz", reach: "Up to 120 contributors", description: "Good for upcoming artists and first release push.", reward: 1200, contributors: 120, duration: "3 days" },
  { id: "growth-push", name: "Growth Push", reach: "Up to 500 contributors", description: "Mid-level awareness for songs, videos, and snippets.", reward: 1600, contributors: 500, duration: "5 days" },
  { id: "viral-momentum", name: "Viral Momentum", reach: "Up to 1,200 contributors", description: "Trend-focused distribution for sound and teaser campaigns.", reward: 2200, contributors: 1200, duration: "7 days" },
  { id: "release-week-blast", name: "Release Week Blast", reach: "High-intensity release week", description: "Fast campaign pacing for launch windows and project drops.", reward: 2600, contributors: 1800, duration: "5 days" },
];

const creatorPackages: Package[] = [
  { id: "starter-visibility", name: "Starter Visibility", reach: "Up to 120 contributors", description: "Good for small creators testing content visibility.", reward: 1200, contributors: 120, duration: "3 days" },
  { id: "growth-momentum", name: "Growth Momentum", reach: "Up to 550 contributors", description: "Increase creator discovery and engagement quality.", reward: 1600, contributors: 550, duration: "5 days" },
  { id: "creator-viral-push", name: "Viral Push", reach: "Up to 1,300 contributors", description: "Aggressive visibility for clips and algorithm momentum.", reward: 2200, contributors: 1300, duration: "7 days" },
  { id: "community-expansion", name: "Community Expansion", reach: "Fanbase growth focus", description: "Built for communities, livestreams, and audience retention.", reward: 1800, contributors: 800, duration: "10 days" },
];

const businessPackages: Package[] = [
  { id: "starter-awareness", name: "Starter Awareness", reach: "Up to 100 contributors", description: "Good for small and local businesses.", reward: 1200, contributors: 100, duration: "3 days" },
  { id: "growth-visibility", name: "Growth Visibility", reach: "Up to 500 contributors", description: "Expand local and online reach.", reward: 1500, contributors: 500, duration: "7 days" },
  { id: "community-blast", name: "Community Blast", reach: "Up to 1,000 contributors", description: "High-volume local awareness for offers and events.", reward: 1900, contributors: 1000, duration: "7 days" },
  { id: "premium-visibility", name: "Premium Visibility Push", reach: "Large-scale multi-platform push", description: "Best for broader product, brand, and traffic campaigns.", reward: 2400, contributors: 1600, duration: "14 days" },
];

const contentPackages: Package[] = [
  { id: "starter-distribution", name: "Starter Distribution", reach: "Up to 100 contributors", description: "A clean first push for flyers, posts, and announcements.", reward: 1200, contributors: 100, duration: "3 days" },
  { id: "growth-distribution", name: "Growth Distribution", reach: "Up to 500 contributors", description: "Balanced distribution across selected platforms and interests.", reward: 1500, contributors: 500, duration: "5 days" },
  { id: "viral-content-push", name: "Viral Push", reach: "High-volume awareness distribution", description: "Built for mass content exposure and repeated visibility.", reward: 2100, contributors: 1200, duration: "7 days" },
];

const appTestingPackages: Package[] = [
  { id: "quick-test", name: "Quick Test", reach: "Up to 60 testers", description: "Light onboarding participation with short structured feedback.", reward: 1800, contributors: 60, duration: "3 days" },
  { id: "feedback-collection", name: "Feedback Collection", reach: "Up to 150 testers", description: "Focused user insight collection for product, website, or app experience.", reward: 2400, contributors: 150, duration: "5 days" },
  { id: "product-validation", name: "Product Validation", reach: "Up to 300 testers", description: "Structured testing campaign for onboarding, features, and trust signals.", reward: 3200, contributors: 300, duration: "7 days" },
  { id: "advanced-testing", name: "Advanced Testing", reach: "Deep product participation", description: "High-detail testing with reports, screenshots, reproduction steps, and review quality checks.", reward: 5000, contributors: 120, duration: "10 days" },
];

const defaultFlow: CategoryFlow = {
  id: "default",
  builderIntro: "Launch a guided growth campaign in minutes.",
  contentHeadline: "What would you like to promote?",
  contentHelp: "Choose the closest campaign type. Qeixova will use this to guide rewards, proof, and targeting.",
  contentTypes: defaultContentTypes,
  goalsHeadline: "What should contributors help you achieve?",
  goals,
  uploadRequirements: {
    Flyer: ["Campaign flyer or banner", "Campaign link", "Suggested caption"],
    Video: ["Video link or file", "Thumbnail", "Caption", "Hashtags"],
    Audio: ["Audio file or link", "Cover image", "Caption"],
    "Product image": ["Product image", "Description", "CTA link"],
    Link: ["Campaign link", "Short description", "Proof instructions"],
  },
  linkLabel: "Campaign link",
  linkPlaceholder: "https://your-campaign-link.com",
  captionLabel: "Suggested caption",
  captionPlaceholder: "Optional caption contributors can use...",
  bundlesHeadline: "Choose the campaign bundle",
  targetHeadline: "Choose target contributors",
  targetHelp: "Start broad, then add location or platform focus where it helps.",
  interests: interestOptions,
  levels: levelOptions,
  packages,
  launchHeadline: "Your campaign is queued for growth.",
  launchSummary: "Qeixova will distribute it to relevant contributors based on interests, platform activity, contributor level, and location relevance.",
  launchCta: "Launch campaign",
  previewLabel: "Campaign Preview",
  defaultContentType: "Flyer",
  defaultGoal: "Increase visibility",
  defaultTitle: "Business Awareness Campaign",
  defaultInterests: ["Business", "Local Communities"],
  defaultLevels: ["All Contributors"],
  defaultBundleId: "story-status",
};

const categoryFlows: Record<string, CategoryFlow> = {
  content: {
    ...defaultFlow,
    id: "content",
    builderIntro: "Promote flyers, announcements, videos, posts, and awareness content through real human distribution.",
    contentHeadline: "What would you like to distribute?",
    contentHelp: "Select the content type first so Qeixova can narrow upload requirements, supported platforms, contributor actions, and proof.",
    contentTypes: ["Flyer Promotion", "Video Distribution", "Social Media Post", "Announcement Campaign", "Multi-Content Campaign"],
    goalsHeadline: "What do you want this distribution campaign to achieve?",
    goals: ["Increase Local Awareness", "Expand Online Reach", "Promote A Launch", "Boost Community Visibility", "Increase Content Exposure", "Drive Traffic To A Link", "Support Viral Momentum"],
    uploadRequirements: {
      "Flyer Promotion": ["Flyer image", "Optional caption", "Optional website/social link", "Portrait flyer performs best", "Clear headline", "Strong CTA"],
      "Video Distribution": ["Video file or video link", "Caption", "Hashtags optional", "Supported: TikTok, Instagram, Facebook, WhatsApp"],
      "Social Media Post": ["Post URL", "Caption", "Platform source"],
      "Announcement Campaign": ["Banner/flyer", "Announcement text", "Important details", "CTA link optional"],
      "Multi-Content Campaign": ["Multiple content assets", "Caption set", "Primary CTA link", "Distribution notes"],
    },
    linkLabel: "Content, post, or traffic link",
    linkPlaceholder: "Paste website, profile, landing page, post, streaming, or campaign link",
    captionLabel: "Distribution caption",
    captionPlaceholder: "Example: Please share this update, use the caption, and keep it visible...",
    bundlesHeadline: "Choose distribution platforms",
    targetHeadline: "Choose target contributors",
    targetHelp: "Match your distribution to the right interests, contributor quality, and local audience.",
    interests: ["Entertainment", "Business", "Fashion", "Students", "Lifestyle", "Music", "Technology", "Local Communities"],
    levels: ["All Contributors", "Verified Contributors", "Premium Promoters", "Community Influencers"],
    packages: contentPackages,
    launchHeadline: "Your Content Distribution Campaign Is Ready",
    launchSummary: "Qeixova will distribute your campaign based on selected platforms, audience interests, contributor quality, and location targeting.",
    launchCta: "Launch Campaign",
    previewLabel: "Distribution Campaign Preview",
    defaultContentType: "Flyer Promotion",
    defaultGoal: "Increase Local Awareness",
    defaultTitle: "Content Distribution Campaign",
    defaultInterests: ["Business", "Local Communities"],
    defaultLevels: ["All Contributors"],
    defaultBundleId: "content-flyer-status",
  },
  music: {
    ...defaultFlow,
    id: "music",
    builderIntro: "Build release buzz, trend activity, and community-powered music visibility.",
    contentHeadline: "What music are you pushing?",
    contentHelp: "Choose the music campaign type so Qeixova can shape the upload fields, contributor actions, bundles, and verification.",
    contentTypes: ["Song Release", "Music Video", "Song Snippet / Teaser", "Streaming Campaign", "TikTok Sound Campaign", "Artist Awareness Campaign", "Album / EP Launch"],
    goalsHeadline: "What would you like this music campaign to achieve?",
    goals: ["Increase Song Awareness", "Push Viral Momentum", "Grow Artist Visibility", "Increase Streams", "Promote A Music Video", "Boost TikTok Usage", "Build Fan Engagement"],
    uploadRequirements: {
      "Song Release": ["Song cover art", "Streaming link", "Audio snippet optional", "Artist name", "Song title"],
      "Music Video": ["Video link", "Thumbnail", "Caption", "Hashtags optional"],
      "Song Snippet / Teaser": ["Short clip", "Cover art", "Caption", "Hashtags optional"],
      "Streaming Campaign": ["Streaming link", "Song cover art", "Artist name", "Song title"],
      "TikTok Sound Campaign": ["TikTok sound link", "Sample video", "Suggested trend caption", "Challenge instructions optional"],
      "Artist Awareness Campaign": ["Artist photo or flyer", "Artist bio", "Social profile link", "Campaign caption"],
      "Album / EP Launch": ["Cover art", "Track list", "Streaming links", "Promo flyer", "Artist bio optional"],
    },
    linkLabel: "Music or streaming link",
    linkPlaceholder: "Paste Audiomack, Spotify, Boomplay, TikTok sound, or video link",
    captionLabel: "Music promo caption",
    captionPlaceholder: "Example: New sound out now. Stream, share, and tag the artist...",
    bundlesHeadline: "Recommended music promotion bundle",
    targetHeadline: "Choose music-focused contributors",
    targetHelp: "Music campaigns perform better when contributor interests, creator activity, and local buzz match the sound.",
    interests: ["Music", "Entertainment", "Dance", "Lifestyle", "Campus Communities", "Creators", "Pop Culture"],
    levels: ["All Contributors", "Verified Music Promoters", "Trend Creators", "Community Influencers"],
    packages: musicPackages,
    launchHeadline: "Your music campaign is ready to go live",
    launchSummary: "Qeixova will distribute your campaign based on music interests, creator activity, platform relevance, trend behavior, and location targeting.",
    launchCta: "Launch Music Campaign",
    previewLabel: "Music Promo Preview",
    defaultContentType: "Song Release",
    defaultGoal: "Increase Song Awareness",
    defaultTitle: "Music Release Promotion",
    defaultInterests: ["Music", "Entertainment", "Campus Communities"],
    defaultLevels: ["All Contributors"],
    defaultBundleId: "music-story-status",
  },
  creator: {
    ...defaultFlow,
    id: "creator",
    builderIntro: "Grow creator visibility, social momentum, and audience engagement.",
    contentHeadline: "What creator campaign are you promoting?",
    contentHelp: "Choose the content type so the flow can adapt platforms, actions, verification, and the right growth bundle.",
    contentTypes: ["Short-Form Video Promotion", "Content Awareness Campaign", "Creator Page Growth", "Livestream Promotion", "Community Growth Campaign", "Podcast / Long-Form Content Promotion", "Personal Brand Awareness"],
    goalsHeadline: "What would you like this creator campaign to achieve?",
    goals: ["Increase Content Reach", "Boost Engagement", "Grow Creator Visibility", "Push Viral Momentum", "Increase Livestream Attendance", "Grow Community Members", "Strengthen Audience Loyalty", "Increase Profile Traffic"],
    uploadRequirements: {
      "Short-Form Video Promotion": ["Video link", "Thumbnail", "Caption", "Hashtags optional"],
      "Content Awareness Campaign": ["Post URL", "Caption", "Creator handle/page link"],
      "Creator Page Growth": ["Creator profile link", "Creator bio", "Promo caption"],
      "Livestream Promotion": ["Livestream flyer/banner", "Stream link", "Stream time/date", "Reminder caption"],
      "Community Growth Campaign": ["Community invite link", "Community description", "Rules/instructions"],
      "Podcast / Long-Form Content Promotion": ["Video/podcast link", "Thumbnail", "Episode title", "Short description"],
      "Personal Brand Awareness": ["Creator profile link", "Brand image", "Short creator bio", "Campaign caption"],
    },
    linkLabel: "Creator content link",
    linkPlaceholder: "Paste TikTok, Instagram, YouTube, livestream, podcast, or community link",
    captionLabel: "Creator campaign caption",
    captionPlaceholder: "Example: Check out this creator, engage with the post, and follow for more...",
    bundlesHeadline: "Recommended creator promotion bundle",
    targetHeadline: "Choose creator-focused contributors",
    targetHelp: "Target by content relevance, social interests, community influence, and creator activity.",
    interests: ["Entertainment", "Lifestyle", "Comedy", "Gaming", "Tech", "Education", "Fashion", "Music", "Sports", "Pop Culture"],
    levels: ["All Contributors", "Verified Creators", "Community Influencers", "Trend Contributors", "Premium Promoters"],
    packages: creatorPackages,
    launchHeadline: "Your creator campaign is ready to go live",
    launchSummary: "Qeixova will distribute your campaign based on creator content relevance, contributor interests, platform activity, visibility potential, and audience targeting.",
    launchCta: "Launch Creator Campaign",
    previewLabel: "Creator Growth Preview",
    defaultContentType: "Short-Form Video Promotion",
    defaultGoal: "Increase Content Reach",
    defaultTitle: "Creator Visibility Campaign",
    defaultInterests: ["Entertainment", "Lifestyle", "Pop Culture"],
    defaultLevels: ["All Contributors"],
    defaultBundleId: "creator-short-form",
  },
  business: {
    ...defaultFlow,
    id: "business",
    builderIntro: "Launch simple business visibility campaigns without complex ad-manager setup.",
    contentHeadline: "What business promotion are you running?",
    contentHelp: "Choose what you want people to discover so Qeixova can recommend the right awareness bundle.",
    contentTypes: ["Product Promotion", "Service Awareness", "Store / Brand Awareness", "Offer / Discount Campaign", "Event Awareness", "Website / Online Store Traffic", "Multi-Promotion Campaign"],
    goalsHeadline: "What would you like this campaign to achieve?",
    goals: ["Increase Local Awareness", "Promote A Product", "Generate Customer Interest", "Drive Store Visits", "Increase Online Traffic", "Promote A Special Offer", "Build Brand Visibility", "Spread Community Awareness"],
    uploadRequirements: {
      "Product Promotion": ["Product images", "Product video optional", "Product description", "Pricing optional", "Website/social link"],
      "Service Awareness": ["Business flyer/banner", "Service description", "Contact information", "Booking link/contact"],
      "Store / Brand Awareness": ["Brand flyer", "Store photos", "Brand description", "Location details"],
      "Offer / Discount Campaign": ["Promo flyer", "Offer details", "Expiry date", "CTA link/contact"],
      "Event Awareness": ["Event flyer", "Event details", "Date/time/location", "CTA link/contact"],
      "Website / Online Store Traffic": ["Website/store link", "Promo image", "CTA text", "Offer summary"],
      "Multi-Promotion Campaign": ["Promo flyer", "Product/service list", "Contact link", "CTA text"],
    },
    linkLabel: "Website, page, or contact link",
    linkPlaceholder: "Paste website, Instagram, WhatsApp, booking, catalog, or store link",
    captionLabel: "Business promo caption",
    captionPlaceholder: "Example: Discover our new offer. Message us today or visit our store...",
    bundlesHeadline: "Recommended business awareness bundle",
    targetHeadline: "Choose business-focused contributors",
    targetHelp: "Local relevance matters. Select interests, contributor quality, and location signals that match your customers.",
    interests: ["Fashion", "Food & Restaurants", "Lifestyle", "Tech", "Beauty", "Local Communities", "Students", "Entertainment", "Shopping"],
    levels: ["All Contributors", "Verified Contributors", "Community Influencers", "Local Promoters", "Premium Contributors"],
    packages: businessPackages,
    launchHeadline: "Your business awareness campaign is ready",
    launchSummary: "Qeixova will distribute your campaign based on audience interests, local relevance, platform activity, contributor quality, and visibility potential.",
    launchCta: "Launch Campaign",
    previewLabel: "Business Growth Preview",
    defaultContentType: "Product Promotion",
    defaultGoal: "Increase Local Awareness",
    defaultTitle: "Business Awareness Campaign",
    defaultInterests: ["Local Communities", "Shopping"],
    defaultLevels: ["All Contributors"],
    defaultBundleId: "business-story-status",
  },
  apps: {
    ...defaultFlow,
    id: "apps",
    builderIntro: "Run structured product testing campaigns with real users, device-aware targeting, and meaningful feedback.",
    contentHeadline: "What would you like users to test?",
    contentHelp: "Choose the testing type first so Qeixova can shape the verification method, tester requirements, proof system, and completion flow.",
    contentTypes: ["App Download & Onboarding", "Feature Testing", "Website Testing", "User Feedback Campaign", "Review & Rating Campaign", "Bug Reporting Campaign", "Multi-Step Testing Campaign"],
    goalsHeadline: "What would you like this testing campaign to achieve?",
    goals: ["Test User Experience", "Identify Bugs & Issues", "Improve Onboarding", "Gather Real Feedback", "Increase Product Adoption", "Improve Product Trust", "Test Feature Performance"],
    uploadRequirements: {
      "App Download & Onboarding": ["App Store / Play Store link", "App description", "Signup instructions", "Test account optional", "Key onboarding steps"],
      "Feature Testing": ["Feature explanation", "Access instructions", "Expected user flow", "Feature screenshots optional"],
      "Website Testing": ["Website URL", "Testing instructions", "Important pages/features", "Goal of test"],
      "User Feedback Campaign": ["Product/app link", "Questions for users", "Feedback form optional", "Areas needing review"],
      "Review & Rating Campaign": ["Product/app link", "Review guidance", "Experience requirements", "Honest feedback policy"],
      "Bug Reporting Campaign": ["Platform access link", "Testing scope", "Known issues optional", "Reporting guidelines"],
      "Multi-Step Testing Campaign": ["Full user journey", "Step-by-step test script", "Required screenshots/videos", "Feedback questions"],
    },
    linkLabel: "App, website, or product access link",
    linkPlaceholder: "Paste Play Store, App Store, TestFlight, APK, staging, website, or product link",
    captionLabel: "Testing brief for contributors",
    captionPlaceholder: "Explain what testers should do, what feedback matters, and any access credentials or limits.",
    bundlesHeadline: "Recommended testing bundle",
    targetHeadline: "Choose target testers",
    targetHelp: "Testing quality depends on device compatibility, product experience, tester reliability, and the depth of feedback you need.",
    interests: ["Technology", "Startups", "Mobile Apps", "Gaming", "Ecommerce", "Productivity", "Finance", "Education"],
    levels: ["All Contributors", "Verified Testers", "Premium Contributors", "Experienced Reviewers", "Beta Test Participants"],
    packages: appTestingPackages,
    launchHeadline: "Your testing campaign is ready",
    launchSummary: "Qeixova will distribute your campaign by testing experience, device compatibility, contributor quality, audience interests, and participation reliability.",
    launchCta: "Launch Testing Campaign",
    previewLabel: "Product Testing Preview",
    defaultContentType: "App Download & Onboarding",
    defaultGoal: "Improve Onboarding",
    defaultTitle: "App Onboarding Test Campaign",
    defaultInterests: ["Technology", "Mobile Apps", "Startups"],
    defaultLevels: ["Verified Testers"],
    defaultBundleId: "apps-quick-onboarding",
  },
};

const steps = [
  "Promote",
  "Goal",
  "Content",
  "Mission",
  "Target",
  "Budget",
  "Preview",
  "Launch",
];

function MultiSelectDropdown({ options, selected, onChange, placeholder = "Select options" }: { options: string[]; selected: string[]; onChange: (next: string[]) => void; placeholder?: string }) {
  const toggle = (option: string) => onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]);
  const preview = selected.length ? selected.slice(0, 3).join(", ") : placeholder;

  return (
    <details className="multiSelectDropdown">
      <summary>
        <span>
          <strong>{selected.length ? `${selected.length} selected` : "Choose"}</strong>
          <small>{preview}{selected.length > 3 ? ` +${selected.length - 3} more` : ""}</small>
        </span>
        <em>v</em>
      </summary>
      {selected.length > 0 && (
        <div className="selectedPreview">
          {selected.slice(0, 6).map((item) => <span key={item}>{item}</span>)}
        </div>
      )}
      <div className="multiSelectMenu">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button key={option} type="button" onClick={() => toggle(option)} className={active ? "selected" : ""}>
              <span>{active ? "OK" : ""}</span>
              <strong>{option}</strong>
            </button>
          );
        })}
      </div>
    </details>
  );
}

function PlatformChoiceGrid({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (next: string[]) => void }) {
  const toggle = (option: string) => onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]);

  return (
    <div className="choicePlatformGrid">
      {options.map((option) => {
        const active = selected.includes(option);
        const meta = platformMeta[option] ?? {
          icon: option.split(" ").map((word) => word[0]).join("").slice(0, 2),
          recommendedFor: "Flexible content",
          visibility: "Platform visibility",
          audience: "Relevant audiences",
        };
        return (
          <button key={option} type="button" onClick={() => toggle(option)} className={active ? "choicePlatformCard selected" : "choicePlatformCard"}>
            <b>{meta.icon}</b>
            <span>{option}</span>
            <strong>{meta.visibility}</strong>
            <small>{meta.recommendedFor}</small>
            <em>{meta.audience}</em>
          </button>
        );
      })}
    </div>
  );
}

function getCategoryFlow(categoryId: string) {
  return categoryFlows[categoryId] ?? defaultFlow;
}

function getBundlesForCategory(categoryId: string) {
  if (categoryId === "content") return campaignBundles.filter((bundle) => bundle.id.startsWith("content-"));
  if (categoryId === "music") return campaignBundles.filter((bundle) => bundle.id.startsWith("music-"));
  if (categoryId === "creator") return campaignBundles.filter((bundle) => bundle.id.startsWith("creator-"));
  if (categoryId === "business") return campaignBundles.filter((bundle) => bundle.id.startsWith("business-"));
  if (categoryId === "apps") return campaignBundles.filter((bundle) => bundle.id.startsWith("apps-"));
  return campaignBundles.filter((bundle) => !bundle.id.startsWith("content-") && !bundle.id.startsWith("music-") && !bundle.id.startsWith("creator-") && !bundle.id.startsWith("business-") && !bundle.id.startsWith("apps-"));
}

function getRecommendedBundle(contentType: string, categoryId: string, goal = "") {
  if (categoryId === "content") {
    if (contentType === "Video Distribution" || goal === "Support Viral Momentum") return campaignBundles.find((bundle) => bundle.id === "content-video-distribution") ?? campaignBundles[0];
    if (contentType === "Social Media Post" || goal === "Expand Online Reach") return campaignBundles.find((bundle) => bundle.id === "content-social-post") ?? campaignBundles[0];
    if (contentType === "Announcement Campaign" || goal === "Boost Community Visibility" || goal === "Promote A Launch") return campaignBundles.find((bundle) => bundle.id === "content-community-announcement") ?? campaignBundles[0];
    if (goal === "Drive Traffic To A Link") return campaignBundles.find((bundle) => bundle.id === "content-traffic-push") ?? campaignBundles[0];
    return campaignBundles.find((bundle) => bundle.id === "content-flyer-status") ?? campaignBundles[0];
  }
  if (categoryId === "music") {
    if (contentType === "TikTok Sound Campaign" || contentType === "Song Snippet / Teaser" || goal === "Push Viral Momentum" || goal === "Boost TikTok Usage") return campaignBundles.find((bundle) => bundle.id === "music-short-video") ?? campaignBundles[0];
    if (contentType === "Streaming Campaign" || goal === "Increase Streams") return campaignBundles.find((bundle) => bundle.id === "music-streaming") ?? campaignBundles[0];
    if (contentType === "Artist Awareness Campaign" || goal === "Build Fan Engagement") return campaignBundles.find((bundle) => bundle.id === "music-fan-engagement") ?? campaignBundles[0];
    return campaignBundles.find((bundle) => bundle.id === "music-story-status") ?? campaignBundles[0];
  }
  if (categoryId === "creator") {
    if (contentType === "Livestream Promotion" || goal === "Increase Livestream Attendance") return campaignBundles.find((bundle) => bundle.id === "creator-livestream") ?? campaignBundles[0];
    if (contentType === "Community Growth Campaign" || goal === "Grow Community Members") return campaignBundles.find((bundle) => bundle.id === "creator-community") ?? campaignBundles[0];
    if (contentType === "Short-Form Video Promotion" || goal === "Push Viral Momentum") return campaignBundles.find((bundle) => bundle.id === "creator-short-form") ?? campaignBundles[0];
    if (goal === "Boost Engagement" || goal === "Increase Profile Traffic") return campaignBundles.find((bundle) => bundle.id === "creator-engagement") ?? campaignBundles[0];
    return campaignBundles.find((bundle) => bundle.id === "creator-story-status") ?? campaignBundles[0];
  }
  if (categoryId === "business") {
    if (contentType === "Website / Online Store Traffic" || goal === "Increase Online Traffic") return campaignBundles.find((bundle) => bundle.id === "business-traffic") ?? campaignBundles[0];
    if (contentType === "Event Awareness" || goal === "Spread Community Awareness" || goal === "Drive Store Visits") return campaignBundles.find((bundle) => bundle.id === "business-community") ?? campaignBundles[0];
    if (contentType === "Store / Brand Awareness" || goal === "Build Brand Visibility") return campaignBundles.find((bundle) => bundle.id === "business-social-feed") ?? campaignBundles[0];
    if (contentType === "Product Promotion" && goal === "Promote A Product") return campaignBundles.find((bundle) => bundle.id === "business-short-form") ?? campaignBundles[0];
    return campaignBundles.find((bundle) => bundle.id === "business-story-status") ?? campaignBundles[0];
  }
  if (categoryId === "apps") {
    if (contentType === "Bug Reporting Campaign" || goal === "Identify Bugs & Issues") return campaignBundles.find((bundle) => bundle.id === "apps-deep-testing") ?? campaignBundles[0];
    if (contentType === "Feature Testing" || goal === "Test Feature Performance") return campaignBundles.find((bundle) => bundle.id === "apps-feature-validation") ?? campaignBundles[0];
    if (contentType === "Website Testing" || contentType === "User Feedback Campaign" || goal === "Gather Real Feedback" || goal === "Test User Experience") return campaignBundles.find((bundle) => bundle.id === "apps-user-feedback") ?? campaignBundles[0];
    if (contentType === "Review & Rating Campaign" || goal === "Improve Product Trust") return campaignBundles.find((bundle) => bundle.id === "apps-review-trust") ?? campaignBundles[0];
    if (contentType === "Multi-Step Testing Campaign") return campaignBundles.find((bundle) => bundle.id === "apps-deep-testing") ?? campaignBundles[0];
    return campaignBundles.find((bundle) => bundle.id === "apps-quick-onboarding") ?? campaignBundles[0];
  }
  if (categoryId === "community") return campaignBundles.find((bundle) => bundle.id === "community-growth") ?? campaignBundles[0];
  if (categoryId === "video" || categoryId === "music" || contentType === "Video") return campaignBundles.find((bundle) => bundle.id === "video-distribution") ?? campaignBundles[0];
  if (contentType === "Link" || categoryId === "apps" || categoryId === "surveys") return campaignBundles.find((bundle) => bundle.id === "guided-engagement") ?? campaignBundles[0];
  return campaignBundles.find((bundle) => bundle.id === "story-status") ?? campaignBundles[0];
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const [categoryId, setCategoryId] = useState("content");
  const [goal, setGoal] = useState("Increase Local Awareness");
  const [contentType, setContentType] = useState("Flyer Promotion");
  const [contentLink, setContentLink] = useState("");
  const [fileName, setFileName] = useState("");
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("Content Distribution Campaign");
  const [bundleId, setBundleId] = useState("content-flyer-status");
  const [actions, setActions] = useState<string[]>(["Post flyer to WhatsApp status", "Post to Facebook story", "Post to Instagram story", "Use provided caption", "Keep post active for 24 hours"]);
  const [instructions, setInstructions] = useState("Leave the post visible for at least 24 hours.");
  const [interests, setInterests] = useState<string[]>(["Local Communities", "Shopping"]);
  const [platforms, setPlatforms] = useState<string[]>(["WhatsApp Status"]);
  const [levels, setLevels] = useState<string[]>(["All Contributors"]);
  const [states, setStates] = useState<string[]>(["Lagos"]);
  const [cities, setCities] = useState<string[]>([]);
  const [campuses, setCampuses] = useState<string[]>([]);
  const [packageId, setPackageId] = useState("starter-distribution");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [customReward, setCustomReward] = useState("");
  const [customContributors, setCustomContributors] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [customPacing, setCustomPacing] = useState("Steady distribution");

  const category = campaignCategories.find((item) => item.id === categoryId) ?? campaignCategories[0];
  const categoryFlow = getCategoryFlow(categoryId);
  const recommendedBundle = getRecommendedBundle(contentType, categoryId, goal);
  const selectedBundle = campaignBundles.find((item) => item.id === bundleId) ?? recommendedBundle;
  const selectedPackage = categoryFlow.packages.find((item) => item.id === packageId) ?? categoryFlow.packages[0];
  const categoryPlatforms = useMemo(() => Array.from(new Set(getBundlesForCategory(categoryId).flatMap((bundle) => bundle.platforms))), [categoryId]);
  const isTestingFlow = categoryId === "apps";
  const flowSteps = isTestingFlow ? ["Test Type", "Goal", "Assets", "Bundle", "Testers", "Package", "Preview", "Launch"] : steps;
  const platformLabel = isTestingFlow ? "Testing platforms and devices" : "Distribution platforms";
  const actionLabel = isTestingFlow ? "What should testers do?" : "What should contributors do?";
  const packageHeadline = isTestingFlow ? "Campaign participation package" : "Campaign reach package";
  const packageHelp = isTestingFlow ? "Choose the testing depth. Higher-value product participation needs stronger rewards and clearer review expectations." : "Choose the momentum level. Advanced controls are available when you need exact limits.";
  const previewHelp = isTestingFlow ? "This product testing preview shows objectives, tester actions, proof, and feedback expectations before launch." : "This is the confidence check before launch. It mirrors what contributors need to understand.";
  const resolvedReward = advancedOpen && Number(customReward) > 0 ? Number(customReward) : selectedPackage.reward;
  const resolvedContributors = advancedOpen && Number(customContributors) > 0 ? Number(customContributors) : selectedPackage.contributors;
  const resolvedDuration = advancedOpen && customDuration.trim() ? customDuration.trim() : selectedPackage.duration;
  const estimatedBudget = resolvedReward * resolvedContributors;

  useEffect(() => {
    fetch("/api/business/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/business/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.business) setBusiness(data.business);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const previewInstructions = useMemo(() => {
    return [
      `Goal: ${goal}.`,
      selectedBundle ? `Campaign bundle: ${selectedBundle.name}. Verification: ${selectedBundle.verification.join(", ")}.` : "",
      contentType ? `Campaign content: ${contentType}${contentLink ? ` - ${contentLink}` : fileName ? ` - ${fileName}` : ""}.` : "",
      actions.length ? `Contributor actions: ${actions.join(", ")}.` : "",
      caption ? `Suggested caption: ${caption}` : "",
      instructions ? `Important instructions: ${instructions}` : "",
      `Audience: ${interests.length ? interests.join(", ") : "All interests"}.`,
      `${isTestingFlow ? "Testing platforms/devices" : "Platforms"}: ${platforms.length ? platforms.join(", ") : "All platforms"}.`,
      `Contributor level: ${levels.join(", ")}.`,
      cities.length || campuses.length ? `Local focus: ${[...cities, ...campuses].join(", ")}.` : "",
      advancedOpen ? `Campaign pacing: ${customPacing}.` : "",
    ].filter(Boolean).join("\n");
  }, [actions, advancedOpen, campuses, caption, cities, contentLink, contentType, customPacing, fileName, goal, instructions, interests, isTestingFlow, levels, platforms, selectedBundle]);

  const proofLabel = useMemo(() => {
    if (actions.some((action) => action.toLowerCase().includes("feedback"))) return "Submit your feedback and attach proof if requested";
    if (actions.some((action) => action.toLowerCase().includes("download"))) return "Upload a screenshot showing the app installed or opened";
    return "Upload a screenshot showing your post, share, or completed action";
  }, [actions]);

  const recommended = useMemo(() => {
    const recommendedPlatforms = platforms.length ? platforms.slice(0, 3).join(", ") : isTestingFlow ? "Android, iPhone/iOS, Desktop Users" : "WhatsApp, Instagram, TikTok";
    const quality = isTestingFlow ? "structured tester feedback" : category.missionType === "premium" ? "high-touch participation" : category.missionType === "participation" ? "useful feedback quality" : "fast visibility";
    return { platforms: recommendedPlatforms, quality };
  }, [category.missionType, isTestingFlow, platforms]);

  const applyBundle = (bundle: CampaignBundle) => {
    setBundleId(bundle.id);
    setPlatforms(bundle.platforms);
    setActions(bundle.actions);
    setInstructions(
      bundle.id.startsWith("apps-")
        ? "Complete the assigned testing flow carefully. Submit clear proof, honest feedback, issues encountered, and improvement suggestions. Do not submit fake or manipulated reviews."
        : bundle.id === "story-status"
        ? "Use the provided caption, keep the story/status visible for 24 hours, and upload screenshots with timestamps."
        : bundle.id === "video-distribution"
          ? "Use the provided caption and hashtags, keep the video public during the campaign, and submit repost links or screenshots."
          : bundle.id === "community-growth"
            ? "Join the selected community, remain active for the required duration, and submit proof of membership or participation."
            : "Follow the campaign instruction, submit proof clearly, and keep the action visible until review is complete."
    );
  };

  const applyFlow = (nextCategoryId: string) => {
    const flow = getCategoryFlow(nextCategoryId);
    const bundle = campaignBundles.find((item) => item.id === flow.defaultBundleId) ?? getRecommendedBundle(flow.defaultContentType, nextCategoryId, flow.defaultGoal);
    setCategoryId(nextCategoryId);
    setGoal(flow.defaultGoal);
    setContentType(flow.defaultContentType);
    setTitle(flow.defaultTitle);
    setInterests(flow.defaultInterests);
    setLevels(flow.defaultLevels);
    setPackageId(flow.packages[0]?.id ?? "starter");
    setCustomPacing(nextCategoryId === "apps" ? "Manual review first" : nextCategoryId === "music" ? "Fast launch burst" : nextCategoryId === "creator" ? "Weekend push" : "Steady distribution");
    applyBundle(bundle);
  };

  const applyContentType = (nextContentType: string) => {
    setContentType(nextContentType);
    applyBundle(getRecommendedBundle(nextContentType, categoryId, goal));
  };

  const canContinue = () => {
    if (stepIndex === 0) return Boolean(categoryId) && Boolean(contentType);
    if (stepIndex === 1) return Boolean(goal);
    if (stepIndex === 2) return Boolean(contentType) && (contentLink.trim() || fileName || (!isTestingFlow && contentType !== "Link"));
    if (stepIndex === 3) return Boolean(title.trim()) && actions.length > 0;
    if (stepIndex === 4) return platforms.length > 0 && levels.length > 0;
    if (stepIndex === 5) return resolvedReward >= 1000 && resolvedContributors > 0;
    return true;
  };

  const nextStep = () => {
    setError("");
    if (!canContinue()) {
      setError("Complete the highlighted choices so Qeixova can shape the campaign properly.");
      return;
    }
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const previousStep = () => {
    setError("");
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const generateCaption = () => {
    const platformHint = platforms.length ? `on ${platforms[0]}` : "today";
    if (categoryId === "music") {
      setCaption(`New music alert: ${title || "this release"} is out now. Listen, share ${platformHint}, use the sound, and help more people discover the artist.`);
      return;
    }
    if (categoryId === "creator") {
      setCaption(`Discover ${title || "this creator campaign"}. Watch, engage, share ${platformHint}, and help the content reach the right audience.`);
      return;
    }
    if (isTestingFlow) {
      setCaption(`Test ${title || "this product"} with care. Complete the assigned flow, note any friction or bugs, and submit honest feedback based on your real experience.`);
      return;
    }
    setCaption(`Discover ${title || category.title}. Join the conversation ${platformHint}, share with your circle, and help more people see what is coming from ${business?.name || "this brand"}.`);
  };

  const handleSubmit = async () => {
    if (!canContinue()) {
      setError("Review the campaign details before launch.");
      return;
    }

    setSaving(true);
    setError("");
    const payload = {
      title: title.trim(),
      category: category.category,
      reward: String(resolvedReward),
      duration: resolvedDuration,
      instructions: previewInstructions,
      steps: actions,
      proof_type: actions.some((action) => action.toLowerCase().includes("feedback")) ? "text" : "screenshot",
      proof_label: proofLabel,
      max_screenshots: 2,
      task_link: contentLink.trim(),
      total_budget: String(estimatedBudget),
      target_completion_count: String(resolvedContributors),
      mission_type: category.missionType,
      verification_type: actions.some((action) => action.toLowerCase().includes("feedback")) ? "text" : "screenshot",
      difficulty: category.missionType === "premium" ? "hard" : category.missionType === "participation" ? "medium" : "easy",
      min_level: levels.some((level) => ["Premium Promoters", "Community Influencers", "Premium Contributors", "Experienced Reviewers", "Beta Test Participants"].includes(level)) ? 2 : 1,
      target_professions: levels,
      target_interests: interests,
      target_platforms: platforms,
      target_age_ranges: [],
      target_genders: [],
      target_states: [...states, ...cities, ...campuses],
    };

    const res = await fetch("/api/business/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setSuccess(true);
      setStepIndex(7);
    } else {
      setError(data.error || "Failed to launch campaign");
    }
    setSaving(false);
  };

  if (loading || !business) {
    return (
      <div className="loadingScreen">
        <div className="spinner" />
        <p>Preparing campaign builder...</p>
        <style jsx>{pageStyles}</style>
      </div>
    );
  }

  if (success) {
    return (
      <>
        <BusinessSidebar name={business.name} />
        <main className="page-body campaignPage business-page-pro">
          <section className="launchScreen">
            <div className="launchIcon">
              <Image src="/icon-check-circle.svg" alt="" width={34} height={34} />
            </div>
            <p className="eyebrow">Campaign ready</p>
            <h1>{categoryFlow.launchHeadline}</h1>
            <p className="launchCopy">{categoryFlow.launchSummary}</p>
            <div className="momentumGrid">
              <div><strong>0</strong><span>early participants</span></div>
              <div><strong>Pending</strong><span>approval status</span></div>
              <div><strong>{resolvedContributors.toLocaleString()}</strong><span>estimated reach</span></div>
            </div>
            <div className="launchActions">
              <button type="button" className="secondaryButton" onClick={() => router.push("/business/tasks")}>View dashboard</button>
              <button type="button" className="primaryButton" onClick={() => router.push("/business/tasks/new")}>Create another</button>
            </div>
          </section>
        </main>
        <BusinessBottomNav />
        <style jsx>{pageStyles}</style>
      </>
    );
  }

  return (
    <>
      <BusinessSidebar name={business.name} />
      <main className="page-body campaignPage business-page-pro">
        <header className="campaignHeader">
          <div>
            <p className="eyebrow">Qeixova Tasks</p>
            <h1>Create Campaign</h1>
            <p>{categoryFlow.builderIntro}</p>
          </div>
          <div className="headerStats">
            <span>{flowSteps.length} guided steps</span>
            <strong>{Math.round(((stepIndex + 1) / flowSteps.length) * 100)}%</strong>
          </div>
        </header>

        <nav className="stepper" aria-label="Campaign steps">
          {flowSteps.map((step, index) => (
            <button key={step} type="button" onClick={() => index <= stepIndex && setStepIndex(index)} className={index === stepIndex ? "step active" : index < stepIndex ? "step done" : "step"}>
              <span>{index + 1}</span>
              {step}
            </button>
          ))}
        </nav>

        {error && <div className="errorBox">{error}</div>}

        <div className="builderShell">
          <section className="builderPanel">
            {stepIndex === 0 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 1</p>
                  <h2>{categoryFlow.contentHeadline}</h2>
                  <p>{categoryFlow.contentHelp}</p>
                </div>
                <div className="categoryRail">
                  {campaignCategories.map((item) => {
                    const active = item.id === categoryId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => applyFlow(item.id)}
                        className={active ? "categoryChip selected" : "categoryChip"}
                        style={{ borderColor: active ? item.accent : "#202020" }}
                      >
                        <span style={{ background: `${item.accent}18` }}>
                          <Image src={item.icon} alt="" width={18} height={18} />
                        </span>
                        <strong>{item.title}</strong>
                      </button>
                    );
                  })}
                </div>
                <div className="contentTypeGrid">
                  {categoryFlow.contentTypes.map((item) => {
                    const active = item === contentType;
                    const requirements = categoryFlow.uploadRequirements[item] ?? [];
                    return (
                      <button key={item} type="button" onClick={() => applyContentType(item)} className={active ? "contentTypeCard selected" : "contentTypeCard"}>
                        <span>{active ? "Selected" : "Content type"}</span>
                        <strong>{item}</strong>
                        <small>{requirements.slice(0, 3).join(" • ")}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {stepIndex === 1 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 2</p>
                  <h2>{categoryFlow.goalsHeadline}</h2>
                  <p>Pick the main outcome. Keep it focused so contributors understand the mission quickly.</p>
                </div>
                <div className="goalGrid">
                  {categoryFlow.goals.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setGoal(item);
                        applyBundle(getRecommendedBundle(contentType, categoryId, item));
                      }}
                      className={goal === item ? "goalButton active" : "goalButton"}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stepIndex === 2 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 3</p>
                  <h2>Upload campaign content</h2>
                  <p>Keep the source material clear. Qeixova adapts the requirements to this campaign type.</p>
                </div>
                <div className="splitGrid">
                  <div className="uploadBox">
                    <Image src="/icon-content.svg" alt="" width={30} height={30} />
                    <strong>{fileName || "Drop your campaign asset here"}</strong>
                    <span>{categoryFlow.contentHelp}</span>
                    <div className="requirementList">
                      {(categoryFlow.uploadRequirements[contentType] ?? []).map((requirement) => <small key={requirement}>{requirement}</small>)}
                    </div>
                    <label className="fileButton">
                      Choose file
                      <input type="file" accept="image/*,video/*,audio/*,.pdf" onChange={(event) => setFileName(event.target.files?.[0]?.name || "")} />
                    </label>
                  </div>
                  <div className="fieldStack">
                    <label>
                      Content type
                      <select
                        value={contentType}
                        onChange={(event) => {
                          const nextContentType = event.target.value;
                          applyContentType(nextContentType);
                        }}
                      >
                        {categoryFlow.contentTypes.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </label>
                    <label>
                      {categoryFlow.linkLabel}
                      <input value={contentLink} onChange={(event) => setContentLink(event.target.value)} placeholder={categoryFlow.linkPlaceholder} />
                    </label>
                    <div className="assistBox">
                      <div>
                        <strong>Need help with your caption?</strong>
                        <span>Generate a simple promotional caption from your campaign choices.</span>
                      </div>
                      <button type="button" onClick={generateCaption}>Generate</button>
                    </div>
                    <label>
                      {categoryFlow.captionLabel}
                      <textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={4} placeholder={categoryFlow.captionPlaceholder} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {stepIndex === 3 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 4</p>
                  <h2>{categoryFlow.bundlesHeadline}</h2>
                  <p>{isTestingFlow ? "Qeixova recommends a testing bundle first, then you can customize devices, tester actions, proof checks, and review depth." : "Qeixova recommends a bundle first, then you can customize the exact platforms and actions."}</p>
                </div>
                <div className="fieldStack">
                  <div className="recommendBox">
                    <div className="recommendIcon">
                      <Image src={recommendedBundle.icon} alt="" width={24} height={24} />
                    </div>
                    <div>
                      <span>Recommended bundle</span>
                      <strong>{recommendedBundle.name}</strong>
                      <p>{contentType} campaigns perform best with {recommendedBundle.shortName.toLowerCase()} because the {isTestingFlow ? "testing depth, proof, and feedback structure" : "platforms, actions, and proof"} match how this audience behaves.</p>
                    </div>
                    <button type="button" onClick={() => applyBundle(recommendedBundle)}>Apply</button>
                  </div>
                  <div className="bundleGrid">
                    {getBundlesForCategory(categoryId).map((bundle) => {
                      const active = selectedBundle.id === bundle.id;
                      return (
                        <button
                          key={bundle.id}
                          type="button"
                          onClick={() => applyBundle(bundle)}
                          className={active ? "bundleCard selected" : "bundleCard"}
                        >
                          <span className="bundleIcon">
                            <Image src={bundle.icon} alt="" width={22} height={22} />
                          </span>
                          <strong>{bundle.shortName}</strong>
                          <small>{bundle.description}</small>
                          <em>{bundle.verification.slice(0, 2).join(" + ")}</em>
                        </button>
                      );
                    })}
                  </div>
                  <label>
                    Mission title
                    <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Restaurant Awareness Campaign" />
                  </label>
                  <div>
                    <div className="rowLabel">
                      <p className="labelText">{platformLabel}</p>
                      <span>{platforms.length} selected</span>
                    </div>
                    <PlatformChoiceGrid options={selectedBundle.platforms} selected={platforms} onChange={setPlatforms} />
                  </div>
                  <div>
                    <p className="labelText">{actionLabel}</p>
                    <MultiSelectDropdown options={actionOptions} selected={actions} onChange={setActions} placeholder={isTestingFlow ? "Choose tester actions" : "Choose contributor actions"} />
                  </div>
                  <label>
                    Important instructions
                    <textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} rows={5} placeholder="Leave post for 24 hours. Use the hashtag provided. Avoid deleting repost early." />
                  </label>
                </div>
              </div>
            )}

            {stepIndex === 4 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 5</p>
                  <h2>{categoryFlow.targetHeadline}</h2>
                  <p>{categoryFlow.targetHelp}</p>
                </div>
                <div className="targetStack">
                  <div><p className="labelText">Audience interests</p><MultiSelectDropdown options={categoryFlow.interests} selected={interests} onChange={setInterests} placeholder="Choose audience interests" /></div>
                  <div><p className="labelText">{isTestingFlow ? "Device / platform targeting" : "Extra platform focus"}</p><MultiSelectDropdown options={categoryPlatforms.length ? categoryPlatforms : platformOptions} selected={platforms} onChange={setPlatforms} placeholder={isTestingFlow ? "Choose devices and platforms" : "Choose extra platforms"} /></div>
                  <div><p className="labelText">{isTestingFlow ? "Tester type" : "Contributor type"}</p><MultiSelectDropdown options={categoryFlow.levels} selected={levels} onChange={setLevels} placeholder={isTestingFlow ? "Choose tester types" : "Choose contributor types"} /></div>
                  <div><p className="labelText">Nigeria state targeting</p><MultiSelectDropdown options={stateOptions} selected={states} onChange={setStates} placeholder="Choose states" /></div>
                  <div className="splitGrid compact">
                    <div><p className="labelText">City focus</p><MultiSelectDropdown options={cityOptions} selected={cities} onChange={setCities} placeholder="Choose cities" /></div>
                    <div><p className="labelText">Campus focus</p><MultiSelectDropdown options={campusOptions} selected={campuses} onChange={setCampuses} placeholder="Choose campuses" /></div>
                  </div>
                </div>
              </div>
            )}

            {stepIndex === 5 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 6</p>
                  <h2>{packageHeadline}</h2>
                  <p>{packageHelp}</p>
                </div>
                <div className="packageGrid">
                  {categoryFlow.packages.map((item) => (
                    <button key={item.id} type="button" onClick={() => setPackageId(item.id)} className={packageId === item.id ? "packageCard selected" : "packageCard"}>
                      <span>{item.name}</span>
                      <strong>{item.reach}</strong>
                      <small>{item.description}</small>
                      <em>{item.reward.toLocaleString()} QLT per contributor</em>
                    </button>
                  ))}
                </div>
                <button type="button" className="advancedToggle" onClick={() => setAdvancedOpen((open) => !open)}>
                  {advancedOpen ? "Hide advanced mode" : "Customize advanced mode"}
                </button>
                {advancedOpen && (
                  <div className="advancedGrid">
                    <label>Reward per contributor<input type="number" min={1000} value={customReward} onChange={(event) => setCustomReward(event.target.value)} placeholder="1500" /></label>
                    <label>Contributor limit<input type="number" min={1} value={customContributors} onChange={(event) => setCustomContributors(event.target.value)} placeholder="500" /></label>
                    <label>Campaign duration<input value={customDuration} onChange={(event) => setCustomDuration(event.target.value)} placeholder="7 days" /></label>
                    <label>Campaign pacing<select value={customPacing} onChange={(event) => setCustomPacing(event.target.value)}><option>Steady distribution</option><option>Fast launch burst</option><option>Weekend push</option><option>Manual review first</option></select></label>
                  </div>
                )}
              </div>
            )}

            {stepIndex === 6 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 7</p>
                  <h2>{categoryFlow.previewLabel}</h2>
                  <p>{previewHelp}</p>
                </div>
                <PreviewCard
                  category={category}
                  bundle={selectedBundle}
                  title={title}
                  goal={goal}
                  contributors={resolvedContributors}
                  duration={resolvedDuration}
                  platforms={platforms}
                  interests={interests}
                  actions={actions}
                  instructions={previewInstructions}
                  contentType={contentType}
                  businessName={business.name}
                  budget={estimatedBudget}
                  previewLabel={categoryFlow.previewLabel}
                />
              </div>
            )}

            {stepIndex === 7 && (
              <div className="stepContent">
                <div className="sectionTitle">
                  <p className="eyebrow">Step 8</p>
                  <h2>{categoryFlow.launchHeadline}</h2>
                  <p>{categoryFlow.launchSummary}</p>
                </div>
                <div className="readyPanel">
                  <div className="readyMetric"><span>{isTestingFlow ? "Recommended devices" : "Recommended platforms"}</span><strong>{recommended.platforms}</strong></div>
                  <div className="readyMetric"><span>Expected quality</span><strong>{recommended.quality}</strong></div>
                  <div className="readyMetric"><span>Estimated participation</span><strong>{resolvedContributors.toLocaleString()} contributors</strong></div>
                </div>
              </div>
            )}

            <div className="wizardActions">
              <button type="button" className="secondaryButton" onClick={previousStep} disabled={stepIndex === 0}>Back</button>
              {stepIndex < 7 ? (
                <button type="button" className="primaryButton" onClick={nextStep}>Continue</button>
              ) : (
                <button type="button" className="primaryButton" disabled={saving} onClick={handleSubmit}>{saving ? "Launching..." : categoryFlow.launchCta}</button>
              )}
            </div>
          </section>

          <aside className="summaryPanel">
            <p className="eyebrow">Live summary</p>
            <h3>{title || category.title}</h3>
            <div className="summaryIcon" style={{ background: `${category.accent}18` }}>
              <Image src={category.icon} alt="" width={26} height={26} />
            </div>
            <dl>
              <div><dt>Goal</dt><dd>{goal}</dd></div>
              <div><dt>Platforms</dt><dd>{platforms.length ? platforms.join(", ") : "All platforms"}</dd></div>
              <div><dt>Audience</dt><dd>{interests.length ? interests.join(", ") : "All interests"}</dd></div>
              <div><dt>Reward</dt><dd>{resolvedReward.toLocaleString()} QLT</dd></div>
              <div><dt>Budget</dt><dd>{estimatedBudget.toLocaleString()} QLT</dd></div>
            </dl>
          </aside>
        </div>
      </main>
      <BusinessBottomNav />
      <style jsx>{pageStyles}</style>
    </>
  );
}

function PreviewCard({
  category,
  bundle,
  title,
  goal,
  contributors,
  duration,
  platforms,
  interests,
  actions,
  instructions,
  contentType,
  businessName,
  budget,
  previewLabel,
}: {
  category: CampaignCategory;
  bundle: CampaignBundle;
  title: string;
  goal: string;
  contributors: number;
  duration: string;
  platforms: string[];
  interests: string[];
  actions: string[];
  instructions: string;
  contentType: string;
  businessName: string;
  budget: number;
  previewLabel: string;
}) {
  const estimatedReach = `${Math.max(contributors * 50, 5000).toLocaleString()} - ${Math.max(contributors * 160, 12000).toLocaleString()}`;
  const shownPlatforms = platforms.length ? platforms : bundle.platforms;
  const isTestingPreview = category.id === "apps";

  return (
    <article className="previewCard">
      <div className="previewNav">
        <button type="button" aria-label="Back to edit">{"<"}</button>
        <div>
          <strong>{previewLabel}</strong>
          <span>Review and launch your campaign</span>
        </div>
        <button type="button">Edit</button>
      </div>

      <div className="readyBanner">
        <Image src="/icon-check-circle.svg" alt="" width={28} height={28} />
        <div>
          <strong>Ready to Launch</strong>
          <span>{isTestingPreview ? "Your testing workflow is structured and ready." : "Your campaign bundle is all set."}</span>
        </div>
      </div>

      <div className="previewHero">
        <div className="campaignBadge">
          <Image src={category.icon} alt="" width={25} height={25} />
        </div>
        <div>
          <h3>{title}</h3>
          <p>{category.title} - {bundle.shortName}</p>
        </div>
      </div>

      <div className="goalLine">
        <span>Goal</span>
        <p>{goal} for {businessName} using a guided {bundle.shortName.toLowerCase()} {isTestingPreview ? "workflow" : "campaign"}.</p>
      </div>

      <section className="flyerPanel">
        <div className="panelHeader">
          <strong>{isTestingPreview ? "Testing Objective" : "Campaign"} {contentType}</strong>
          <span>{bundle.shortName}</span>
        </div>
        <div className="mockFlyer">
          <div>
            <span>{businessName}</span>
            <strong>{isTestingPreview ? "USER TESTING" : contentType === "Video" ? "VIDEO BOOST" : "AWARENESS PUSH"}</strong>
            <p>{goal}</p>
          </div>
          <small>{bundle.platforms.slice(0, 3).join(" + ")}</small>
        </div>
      </section>

      <section className="previewSection">
        <div className="panelHeader">
          <strong>{isTestingPreview ? "Testing Platforms & Devices" : "Distribution Platforms"}</strong>
          <span>{shownPlatforms.length} selected</span>
        </div>
        <div className="platformCards">
          {shownPlatforms.slice(0, 4).map((platform, index) => {
            const meta = platformMeta[platform];
            return (
              <div key={platform} className="platformCard">
                <b>{meta?.icon ?? platform.split(" ").map((word) => word[0]).join("").slice(0, 2)}</b>
                <div>
                  <strong>{platform}</strong>
                  <span>{index === 0 ? "Primary" : meta?.visibility ?? "Optional"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="previewSection actionSection">
        <div className="panelHeader">
          <strong>{isTestingPreview ? "Testers Will" : "Contributors Will"}</strong>
          <span>{actions.length} actions</span>
        </div>
        <ul>
          {actions.slice(0, 5).map((action) => (
            <li key={action}><span>OK</span>{action}</li>
          ))}
        </ul>
      </section>

      <section className="previewSection">
        <div className="panelHeader">
          <strong>Target Audience</strong>
          <span>View Details</span>
        </div>
        <div className="audienceRows">
          <div><span>Interests</span><p>{interests.length ? interests.join(", ") : "All interests"}</p></div>
          <div><span>Verification</span><p>{bundle.verification.join(", ")}</p></div>
        </div>
      </section>

      <div className="previewStats">
        <div><strong>{contributors.toLocaleString()}</strong><span>{isTestingPreview ? "Est. Testers" : "Est. Contributors"}</span></div>
        <div><strong>{isTestingPreview ? bundle.verification.length : estimatedReach}</strong><span>{isTestingPreview ? "Proof Checks" : "Est. Reach"}</span></div>
        <div><strong>{duration}</strong><span>Duration</span></div>
        <div><strong>{budget.toLocaleString()} QLT</strong><span>Total Budget</span></div>
      </div>

      <details className="instructionDetails">
        <summary>Verification and instruction details</summary>
        <pre>{instructions}</pre>
      </details>
    </article>
  );
}

const pageStyles = `
  .campaignPage {
    max-width: 1180px;
    margin: 0 auto;
    color: #f5f5f5;
    width: 100%;
    overflow-x: hidden;
  }
  .loadingScreen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 14px;
    background: #050505;
    color: #aaa;
  }
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #171717;
    border-top-color: #f5a623;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .campaignHeader {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 18px;
    min-width: 0;
  }
  .campaignHeader > div {
    min-width: 0;
  }
  .campaignHeader h1 {
    font-size: clamp(28px, 5vw, 42px);
    line-height: 1.05;
    letter-spacing: 0;
    margin: 4px 0 8px;
  }
  .campaignHeader p, .sectionTitle p, .launchCopy {
    color: #aaa;
    font-size: 14px;
    line-height: 1.6;
  }
  .eyebrow {
    color: #f5a623 !important;
    font-size: 11px !important;
    font-weight: 800;
    letter-spacing: 1.3px;
    text-transform: uppercase;
  }
  .headerStats {
    min-width: 132px;
    border: 1px solid #202020;
    background: #0a0a0a;
    border-radius: 14px;
    padding: 12px;
    text-align: right;
  }
  .headerStats span {
    display: block;
    color: #777;
    font-size: 11px;
    margin-bottom: 6px;
  }
  .headerStats strong {
    color: #1aef22;
    font-size: 22px;
  }
  .stepper {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 6px 0 16px;
    margin-bottom: 8px;
    max-width: 100%;
    scrollbar-width: none;
  }
  .stepper::-webkit-scrollbar {
    display: none;
  }
  .step {
    border: 1px solid #202020;
    background: #0a0a0a;
    color: #777;
    border-radius: 999px;
    padding: 8px 12px 8px 8px;
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }
  .step span {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #151515;
    display: grid;
    place-items: center;
    color: #999;
  }
  .step.active {
    color: #f5a623;
    border-color: rgba(245, 166, 35, 0.45);
    background: rgba(245, 166, 35, 0.08);
  }
  .step.done {
    color: #1aef22;
    border-color: rgba(26, 239, 34, 0.24);
  }
  .builderShell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 18px;
    align-items: start;
    min-width: 0;
  }
  .builderPanel, .summaryPanel, .launchScreen {
    border: 1px solid #191919;
    background: #090909;
    border-radius: 20px;
  }
  .builderPanel {
    min-height: 620px;
    padding: 22px;
    min-width: 0;
    overflow: hidden;
  }
  .summaryPanel {
    position: sticky;
    top: 24px;
    padding: 18px;
    min-width: 0;
  }
  .summaryPanel h3 {
    font-size: 20px;
    line-height: 1.2;
    margin: 8px 0 14px;
  }
  .summaryIcon {
    width: 54px;
    height: 54px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    margin-bottom: 14px;
  }
  .summaryPanel dl {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .summaryPanel div {
    min-width: 0;
  }
  .summaryPanel dt {
    color: #777;
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 800;
    margin-bottom: 3px;
  }
  .summaryPanel dd {
    color: #ddd;
    font-size: 13px;
    line-height: 1.45;
  }
  .sectionTitle {
    max-width: 650px;
    margin-bottom: 20px;
    min-width: 0;
  }
  .sectionTitle h2 {
    font-size: clamp(24px, 4vw, 34px);
    line-height: 1.08;
    margin: 5px 0 8px;
    letter-spacing: 0;
  }
  .categoryGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 12px;
  }
  .categoryRail {
    display: flex;
    gap: 9px;
    overflow-x: auto;
    padding: 2px 0 14px;
    margin-bottom: 12px;
    max-width: 100%;
    min-width: 0;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
  }
  .categoryRail::-webkit-scrollbar {
    display: none;
  }
  .categoryChip {
    min-width: 190px;
    border: 1px solid #202020;
    background: #0f0f0f;
    color: #ddd;
    border-radius: 13px;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 9px;
    text-align: left;
    cursor: pointer;
  }
  .categoryChip.selected {
    background: rgba(245, 166, 35, 0.08);
    color: #f5a623;
  }
  .categoryChip span {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .categoryChip strong {
    font-size: 13px;
    line-height: 1.2;
  }
  .contentTypeGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 12px;
    min-width: 0;
  }
  .contentTypeCard {
    min-height: 156px;
    min-width: 0;
    border: 1px solid #202020;
    background: #0f0f0f;
    color: #f5f5f5;
    border-radius: 14px;
    padding: 15px;
    text-align: left;
    cursor: pointer;
  }
  .contentTypeCard.selected {
    border-color: rgba(245, 166, 35, 0.68);
    background: rgba(245, 166, 35, 0.09);
  }
  .contentTypeCard span {
    color: #f5a623;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
  }
  .contentTypeCard strong {
    display: block;
    margin: 10px 0 8px;
    font-size: 18px;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }
  .contentTypeCard small {
    display: block;
    color: #aaa;
    font-size: 12px;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }
  .categoryCard, .packageCard {
    text-align: left;
    border: 1px solid #202020;
    background: #0f0f0f;
    color: #f5f5f5;
    border-radius: 14px;
    padding: 15px;
    cursor: pointer;
    min-height: 228px;
    transition: transform 0.16s ease, border-color 0.16s ease, background 0.16s ease;
  }
  .categoryCard:hover, .packageCard:hover {
    transform: translateY(-2px);
    background: #121212;
  }
  .categoryCard.selected, .packageCard.selected {
    background: rgba(245, 166, 35, 0.07);
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.24);
  }
  .iconBox {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    margin-bottom: 12px;
  }
  .categoryCard strong, .packageCard strong {
    display: block;
    font-size: 15px;
    line-height: 1.25;
    margin-bottom: 7px;
  }
  .categoryCard span, .categoryCard small, .packageCard small, .packageCard em, .assistBox span {
    display: block;
    color: #aaa;
    font-size: 12px;
    line-height: 1.45;
    font-style: normal;
  }
  .categoryCard small {
    color: #777;
    margin-top: 10px;
    overflow-wrap: anywhere;
  }
  .goalGrid, .previewTags {
    display: flex;
    gap: 9px;
    flex-wrap: wrap;
  }
  .goalButton {
    border: 1px solid #282828;
    background: #101010;
    color: #ccc;
    border-radius: 999px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }
  .goalButton.active {
    border-color: rgba(26, 239, 34, 0.55);
    background: rgba(26, 239, 34, 0.1);
    color: #1aef22;
  }
  .multiSelectDropdown {
    border: 1px solid #292929;
    background: #101010;
    border-radius: 14px;
    overflow: hidden;
  }
  .multiSelectDropdown[open] {
    border-color: rgba(245, 166, 35, 0.5);
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.2);
  }
  .multiSelectDropdown summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    padding: 13px 14px;
  }
  .multiSelectDropdown summary::-webkit-details-marker {
    display: none;
  }
  .multiSelectDropdown summary span,
  .multiSelectDropdown summary strong,
  .multiSelectDropdown summary small {
    display: block;
    min-width: 0;
  }
  .multiSelectDropdown summary strong {
    color: #f5f5f5;
    font-size: 13px;
    font-weight: 900;
    margin-bottom: 3px;
  }
  .multiSelectDropdown summary small {
    color: #8d8d8d;
    font-size: 12px;
    line-height: 1.35;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .multiSelectDropdown summary em {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: rgba(245, 166, 35, 0.1);
    color: #f5a623;
    display: grid;
    place-items: center;
    font-style: normal;
    font-size: 12px;
    font-weight: 950;
    flex-shrink: 0;
  }
  .selectedPreview {
    border-top: 1px solid #1f1f1f;
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    padding: 10px 12px;
  }
  .selectedPreview span {
    border: 1px solid rgba(26, 239, 34, 0.3);
    background: rgba(26, 239, 34, 0.09);
    color: #1aef22;
    border-radius: 999px;
    padding: 6px 9px;
    font-size: 11px;
    font-weight: 900;
  }
  .multiSelectMenu {
    border-top: 1px solid #1f1f1f;
    max-height: 310px;
    overflow-y: auto;
    padding: 8px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
  }
  .multiSelectMenu button {
    border: 1px solid #242424;
    background: #0b0b0b;
    color: #d7d7d7;
    border-radius: 11px;
    min-height: 44px;
    padding: 9px 10px;
    display: flex;
    align-items: center;
    gap: 9px;
    text-align: left;
    cursor: pointer;
  }
  .multiSelectMenu button.selected {
    border-color: rgba(26, 239, 34, 0.48);
    background: rgba(26, 239, 34, 0.09);
    color: #1aef22;
  }
  .multiSelectMenu button span {
    width: 22px;
    height: 22px;
    border: 1px solid #363636;
    border-radius: 7px;
    display: grid;
    place-items: center;
    color: #1aef22;
    font-size: 9px;
    font-weight: 950;
    flex-shrink: 0;
  }
  .multiSelectMenu button.selected span {
    border-color: #1aef22;
    background: rgba(26, 239, 34, 0.1);
  }
  .multiSelectMenu button strong {
    color: inherit;
    font-size: 12px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }
  .splitGrid {
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    gap: 16px;
  }
  .splitGrid.compact {
    grid-template-columns: 1fr 1fr;
  }
  .uploadBox {
    border: 1px dashed #333;
    background: #0f0f0f;
    border-radius: 18px;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 12px;
    padding: 26px;
  }
  .uploadBox strong {
    font-size: 17px;
  }
  .uploadBox span {
    color: #888;
    font-size: 13px;
    line-height: 1.55;
    max-width: 320px;
  }
  .requirementList {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
    width: 100%;
    max-width: 360px;
    margin: 2px auto 4px;
  }
  .requirementList small {
    border: 1px solid rgba(245, 166, 35, 0.2);
    background: rgba(245, 166, 35, 0.08);
    color: #f5a623;
    border-radius: 9px;
    padding: 7px 8px;
    font-size: 11px;
    font-weight: 800;
    line-height: 1.25;
  }
  .fileButton {
    position: relative;
    overflow: hidden;
    border-radius: 11px;
    background: #f5a623;
    color: #000;
    padding: 10px 16px;
    font-weight: 900;
    font-size: 13px;
    cursor: pointer;
  }
  .fileButton input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .fieldStack, .targetStack {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  label, .labelText {
    display: block;
    color: #ccc;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.4px;
  }
  input, select, textarea {
    width: 100%;
    margin-top: 7px;
    border: 1px solid #303030;
    background: #121212;
    color: #f5f5f5;
    border-radius: 12px;
    padding: 12px 13px;
    font-size: 14px;
    outline: none;
  }
  textarea {
    resize: vertical;
    line-height: 1.55;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #f5a623;
  }
  .assistBox {
    border: 1px solid rgba(74, 158, 255, 0.22);
    background: rgba(74, 158, 255, 0.07);
    border-radius: 14px;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .assistBox button, .advancedToggle {
    border: 1px solid rgba(74, 158, 255, 0.36);
    background: rgba(74, 158, 255, 0.1);
    color: #7dbaff;
    border-radius: 10px;
    padding: 9px 12px;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
  }
  .recommendBox {
    border: 1px solid rgba(245, 166, 35, 0.26);
    background: linear-gradient(135deg, rgba(245, 166, 35, 0.14), rgba(245, 166, 35, 0.04));
    border-radius: 16px;
    padding: 14px;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
  }
  .recommendIcon, .bundleIcon {
    width: 46px;
    height: 46px;
    border-radius: 13px;
    background: rgba(245, 166, 35, 0.14);
    display: grid;
    place-items: center;
  }
  .recommendBox span, .rowLabel span {
    color: #f5a623;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
  }
  .recommendBox strong {
    display: block;
    color: #fff;
    font-size: 17px;
    margin: 3px 0;
  }
  .recommendBox p {
    color: #aaa;
    font-size: 12px;
    line-height: 1.45;
  }
  .recommendBox button {
    border: 0;
    background: #f5a623;
    color: #050505;
    border-radius: 11px;
    padding: 10px 13px;
    font-weight: 900;
    cursor: pointer;
  }
  .bundleGrid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }
  .choicePlatformGrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .choicePlatformCard {
    border: 1px solid #242424;
    background: #101010;
    color: #f5f5f5;
    border-radius: 14px;
    padding: 12px;
    text-align: left;
    cursor: pointer;
    min-height: 154px;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .choicePlatformCard.selected {
    border-color: rgba(245, 166, 35, 0.62);
    background: rgba(245, 166, 35, 0.08);
  }
  .choicePlatformCard b {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #f5a623;
    color: #050505;
    display: grid;
    place-items: center;
    font-size: 11px;
  }
  .choicePlatformCard span {
    color: #fff;
    font-size: 13px;
    font-weight: 900;
    line-height: 1.2;
  }
  .choicePlatformCard strong, .choicePlatformCard small, .choicePlatformCard em {
    display: block;
    color: #aaa;
    font-size: 11px;
    line-height: 1.35;
    font-style: normal;
  }
  .choicePlatformCard strong {
    color: #f5a623;
  }
  .bundleCard {
    border: 1px solid #242424;
    background: #101010;
    color: #f5f5f5;
    border-radius: 14px;
    padding: 13px;
    text-align: left;
    cursor: pointer;
    min-height: 190px;
  }
  .bundleCard.selected {
    border-color: rgba(245, 166, 35, 0.62);
    background: rgba(245, 166, 35, 0.08);
  }
  .bundleCard strong {
    display: block;
    margin: 11px 0 7px;
    font-size: 14px;
    line-height: 1.2;
  }
  .bundleCard small, .bundleCard em {
    display: block;
    color: #999;
    font-size: 11px;
    line-height: 1.45;
    font-style: normal;
  }
  .bundleCard em {
    color: #f5a623;
    margin-top: 10px;
    font-weight: 800;
  }
  .rowLabel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  .packageGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .packageCard {
    min-height: 180px;
  }
  .packageCard span {
    display: inline-flex;
    color: #f5a623;
    font-size: 12px;
    font-weight: 900;
    margin-bottom: 14px;
  }
  .packageCard strong {
    font-size: 20px;
  }
  .packageCard em {
    color: #1aef22;
    margin-top: 16px;
    font-weight: 800;
  }
  .advancedToggle {
    margin-top: 14px;
  }
  .advancedGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 14px;
    border-top: 1px solid #181818;
    padding-top: 14px;
  }
  .previewCard {
    border: 1px solid #202020;
    background:
      radial-gradient(circle at 78% 0%, rgba(245, 166, 35, 0.14), transparent 28%),
      linear-gradient(180deg, #090b14 0%, #080808 100%);
    border-radius: 24px;
    padding: 16px;
    max-width: 560px;
    margin: 0 auto;
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.32);
  }
  .previewNav {
    display: grid;
    grid-template-columns: 48px 1fr 74px;
    gap: 10px;
    align-items: center;
    margin-bottom: 13px;
  }
  .previewNav button {
    border: 1px solid rgba(245, 166, 35, 0.22);
    background: rgba(255, 255, 255, 0.04);
    color: #f5a623;
    border-radius: 12px;
    height: 38px;
    font-weight: 900;
    cursor: pointer;
  }
  .previewNav div {
    text-align: center;
    min-width: 0;
  }
  .previewNav strong {
    display: block;
    font-size: 16px;
    line-height: 1.2;
  }
  .previewNav span {
    display: block;
    color: #8e8e8e;
    font-size: 12px;
    margin-top: 2px;
  }
  .readyBanner {
    border: 1px solid rgba(26, 239, 34, 0.22);
    background: rgba(26, 239, 34, 0.08);
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 16px;
  }
  .readyBanner strong {
    display: block;
    color: #8dfb93;
    font-size: 13px;
  }
  .readyBanner span {
    color: #93d798;
    font-size: 12px;
  }
  .previewHero {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 10px;
  }
  .campaignBadge {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    background: rgba(245, 166, 35, 0.14);
    flex-shrink: 0;
  }
  .previewHero h3 {
    font-size: clamp(22px, 4vw, 30px);
    line-height: 1.08;
    margin: 0;
  }
  .previewHero p {
    color: #f5a623;
    font-size: 13px;
    margin-top: 3px;
  }
  .goalLine {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    align-items: start;
    margin-bottom: 14px;
  }
  .goalLine span {
    background: #f5a623;
    color: #050505;
    border-radius: 7px;
    padding: 4px 7px;
    font-size: 11px;
    font-weight: 900;
  }
  .goalLine p {
    color: #c9c9c9;
    font-size: 13px;
    line-height: 1.45;
  }
  .flyerPanel, .previewSection {
    border: 1px solid #202333;
    background: rgba(255, 255, 255, 0.035);
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 12px;
  }
  .panelHeader {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
  }
  .panelHeader strong {
    font-size: 13px;
  }
  .panelHeader span {
    color: #f5a623;
    font-size: 12px;
    font-weight: 900;
  }
  .mockFlyer {
    min-height: 210px;
    border-radius: 11px;
    overflow: hidden;
    padding: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background:
      linear-gradient(135deg, rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.68)),
      radial-gradient(circle at 18% 22%, #f5a623 0 8%, transparent 9%),
      radial-gradient(circle at 88% 28%, #1aef22 0 7%, transparent 8%),
      linear-gradient(135deg, #7a1d11, #141414 48%, #3c2104);
  }
  .mockFlyer span {
    color: #f5a623;
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
  }
  .mockFlyer strong {
    display: block;
    max-width: 320px;
    color: #fff;
    font-size: clamp(28px, 9vw, 56px);
    line-height: 0.95;
    margin: 8px 0;
  }
  .mockFlyer p {
    color: #f4f4f4;
    font-size: 13px;
    max-width: 280px;
  }
  .mockFlyer small {
    align-self: flex-start;
    background: rgba(0, 0, 0, 0.55);
    border: 1px solid rgba(245, 166, 35, 0.45);
    color: #f5a623;
    border-radius: 999px;
    padding: 7px 10px;
    font-size: 11px;
    font-weight: 900;
  }
  .platformCards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
  }
  .platformCard {
    border: 1px solid #24283a;
    background: rgba(0, 0, 0, 0.24);
    border-radius: 10px;
    padding: 9px;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  .platformCard b {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #f5a623;
    color: #050505;
    font-size: 12px;
    flex-shrink: 0;
  }
  .platformCard strong {
    display: block;
    font-size: 12px;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }
  .platformCard span {
    color: #f5a623;
    font-size: 10px;
  }
  .actionSection ul {
    list-style: none;
    display: grid;
    gap: 7px;
  }
  .actionSection li {
    display: flex;
    gap: 8px;
    color: #e8e8e8;
    font-size: 13px;
    line-height: 1.3;
  }
  .actionSection li span {
    width: 24px;
    height: 18px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    background: #1aef22;
    color: #050505;
    font-size: 9px;
    font-weight: 900;
  }
  .audienceRows {
    display: grid;
    gap: 8px;
  }
  .audienceRows div {
    display: grid;
    grid-template-columns: 92px 1fr;
    gap: 10px;
    border-top: 1px solid #1e2230;
    padding-top: 8px;
  }
  .audienceRows span {
    color: #aaa;
    font-size: 12px;
    font-weight: 800;
  }
  .audienceRows p {
    color: #f5a623;
    font-size: 12px;
    line-height: 1.45;
  }
  .previewTop {
    display: flex;
    gap: 14px;
    align-items: center;
    margin-bottom: 16px;
  }
  .previewThumb {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .previewTop span {
    color: #f5a623;
    font-size: 12px;
    font-weight: 900;
  }
  .previewTop h3 {
    margin: 4px 0;
    font-size: 22px;
  }
  .previewTop p {
    color: #aaa;
    font-size: 13px;
  }
  .previewStats, .momentumGrid, .readyPanel {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 14px;
  }
  .previewStats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .previewStats div, .momentumGrid div, .readyMetric {
    border: 1px solid #1f1f1f;
    background: #090909;
    border-radius: 13px;
    padding: 12px;
  }
  .previewStats strong, .momentumGrid strong, .readyMetric strong {
    display: block;
    color: #f5f5f5;
    font-size: 18px;
    line-height: 1.15;
  }
  .previewStats span, .momentumGrid span, .readyMetric span {
    display: block;
    color: #888;
    font-size: 11px;
    margin-top: 4px;
  }
  .previewTags span {
    border-radius: 999px;
    background: rgba(245, 166, 35, 0.1);
    color: #f5a623;
    padding: 6px 9px;
    font-size: 11px;
    font-weight: 800;
  }
  .previewCard pre {
    margin-top: 16px;
    white-space: pre-wrap;
    color: #ccc;
    background: #080808;
    border: 1px solid #1a1a1a;
    border-radius: 14px;
    padding: 14px;
    font-family: inherit;
    font-size: 13px;
    line-height: 1.6;
  }
  .instructionDetails {
    border-top: 1px solid #1d2130;
    padding-top: 4px;
  }
  .instructionDetails summary {
    color: #f5a623;
    cursor: pointer;
    font-size: 12px;
    font-weight: 900;
  }
  .readyPanel {
    margin-bottom: 0;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .wizardActions {
    border-top: 1px solid #181818;
    margin-top: 24px;
    padding-top: 18px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  .primaryButton, .secondaryButton {
    border: 0;
    border-radius: 12px;
    padding: 13px 18px;
    font-weight: 900;
    cursor: pointer;
    min-width: 130px;
  }
  .primaryButton {
    background: linear-gradient(135deg, #f5a623, #d89420);
    color: #000;
    box-shadow: 0 8px 24px rgba(245, 166, 35, 0.24);
  }
  .secondaryButton {
    background: #121212;
    border: 1px solid #292929;
    color: #ddd;
  }
  .primaryButton:disabled, .secondaryButton:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .errorBox {
    border: 1px solid rgba(229, 62, 62, 0.3);
    background: rgba(229, 62, 62, 0.1);
    color: #ff8b8b;
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 14px;
    font-size: 13px;
    font-weight: 700;
  }
  .launchScreen {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 36px 24px;
  }
  .launchIcon {
    width: 76px;
    height: 76px;
    border-radius: 22px;
    background: rgba(26, 239, 34, 0.12);
    display: grid;
    place-items: center;
    margin-bottom: 18px;
  }
  .launchScreen h1 {
    font-size: clamp(28px, 6vw, 44px);
    line-height: 1.05;
    max-width: 620px;
    margin: 8px auto 12px;
  }
  .launchCopy {
    max-width: 560px;
    margin-bottom: 22px;
  }
  .momentumGrid {
    width: min(100%, 620px);
  }
  .launchActions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }
  @media (max-width: 980px) {
    .builderShell {
      grid-template-columns: 1fr;
    }
    .summaryPanel {
      position: static;
      order: -1;
    }
    .packageGrid, .momentumGrid, .readyPanel {
      grid-template-columns: 1fr;
    }
    .bundleGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .platformCards, .choicePlatformGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .multiSelectMenu {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 720px) {
    .campaignPage {
      padding-left: 12px !important;
      padding-right: 12px !important;
      padding-bottom: 116px !important;
    }
    .campaignHeader {
      display: block;
    }
    .headerStats {
      margin-top: 14px;
      text-align: left;
    }
    .builderPanel {
      padding: 14px;
      border-radius: 16px;
      min-height: auto;
    }
    .summaryPanel {
      border-radius: 16px;
      padding: 14px;
    }
    .stepContent {
      min-width: 0;
    }
    .categoryGrid, .contentTypeGrid, .splitGrid, .splitGrid.compact, .advancedGrid, .bundleGrid {
      grid-template-columns: 1fr;
    }
    .categoryRail {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      overflow-x: visible;
      padding-bottom: 12px;
    }
    .categoryChip {
      min-width: 0;
      max-width: none;
      width: 100%;
      flex: initial;
      align-items: flex-start;
      min-height: 58px;
    }
    .categoryChip strong {
      overflow-wrap: anywhere;
    }
    .contentTypeCard {
      min-height: 136px;
      padding: 14px;
    }
    .recommendBox {
      grid-template-columns: 1fr;
    }
    .recommendIcon {
      display: none;
    }
    .previewCard {
      border-radius: 18px;
      padding: 12px;
    }
    .previewNav {
      grid-template-columns: 40px 1fr 62px;
    }
    .platformCards, .choicePlatformGrid {
      grid-template-columns: 1fr;
    }
    .multiSelectMenu {
      max-height: 260px;
    }
    .previewStats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .audienceRows div {
      grid-template-columns: 1fr;
      gap: 4px;
    }
    .uploadBox {
      min-height: 240px;
    }
    .wizardActions, .launchActions {
      flex-direction: column;
    }
    .primaryButton, .secondaryButton {
      width: 100%;
    }
  }
`;

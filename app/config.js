// Supabase connection (Project Settings -> API). The publishable key is meant to be public;
// the database security rules protect the data.
window.SIS_CONFIG = {
  supabaseUrl: "https://qronnfjrlvhsomggmpmv.supabase.co",
  supabaseAnonKey: "sb_publishable_HjN6tXUOx44lm_gGbN1MCw_7rHfXE-v",
  // Public half of the web-push key pair (safe to publish). The private half lives only in Supabase secrets.
  vapidPublicKey: "BEn6XllZta_cEgw_ZGnfoovrCii3L28gyhNcATTO16o6GT0UGRtJ2HjPsazBkbK4jmpBnO_RteSqdot6JcAXU7I"
};
window.SIS_CONFIG.mode = "live";

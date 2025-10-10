export default {
  async fetch(request, env) {
    return new Response("Hello World! Worker is working correctly.");
  }
};
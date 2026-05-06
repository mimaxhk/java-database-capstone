/**
 * Footer Component
 * Dynamically renders the footer content on every page
 */

/**
 * Renders the footer with branding, navigation, and legal information
 */
function renderFooter() {
    // Access the footer container element
    const footer = document.getElementById("footer");
  
    // Check if footer element exists
    if (!footer) {
      console.warn("Footer element with id 'footer' not found in the DOM");
      return;
    }
  
    // Inject the footer HTML content
    footer.innerHTML = `
      <footer class="footer">
        <div class="footer-container">
          <!-- Branding and Copyright Section -->
          <div class="footer-logo">
            <img src="/assets/images/logo/logo.png" alt="Hospital CMS Logo" class="footer-logo-img">
            <p>&copy; Copyright 2025. All Rights Reserved by Hospital CMS.</p>
          </div>
  
          <!-- Links Section -->
          <div class="footer-links">
            <!-- Company Column -->
            <div class="footer-column">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#press">Press</a>
            </div>
  
            <!-- Support Column -->
            <div class="footer-column">
              <h4>Support</h4>
              <a href="#account">Account</a>
              <a href="#help">Help Center</a>
              <a href="#contact">Contact Us</a>
            </div>
  
            <!-- Legals Column -->
            <div class="footer-column">
              <h4>Legals</h4>
              <a href="#terms">Terms & Conditions</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#licensing">Licensing</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
  
  /**
   * Initialize footer when DOM is ready
   */
  document.addEventListener("DOMContentLoaded", function() {
    renderFooter();
  });
  
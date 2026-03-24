import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-12">Last updated: March 24, 2026</p>

        <div className="space-y-10 font-body text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              Xiilio.ai ("we," "our," or "us") operates the Xiilio.ai website and mobile application
              (collectively, the "Service"). This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our Service. By using the Service, you agree
              to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect the following types of information:</p>
            <h3 className="text-foreground font-medium mb-2">Personal Information</h3>
            <p className="mb-3">
              When you submit our contact form or interact with our voice agent (Aria), we may collect:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Company name</li>
              <li>Message content</li>
              <li>Booking and scheduling preferences</li>
            </ul>
            <h3 className="text-foreground font-medium mb-2">Automatically Collected Information</h3>
            <p>
              When you access the Service, we may automatically collect device information, browser type,
              IP address, pages visited, and interaction data to improve our Service and user experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Respond to your inquiries and contact form submissions</li>
              <li>Schedule follow-up calls and appointments with our team</li>
              <li>Provide, maintain, and improve our Service</li>
              <li>Communicate with you about our services, updates, and promotions</li>
              <li>Monitor usage patterns and analyze trends</li>
              <li>Protect against unauthorized access and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Data Sharing & Disclosure</h2>
            <p className="mb-3">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="text-foreground">Service providers</span> — third-party vendors that assist in operating our Service (e.g., hosting, analytics, scheduling)</li>
              <li><span className="text-foreground">Legal compliance</span> — when required by law, regulation, or legal process</li>
              <li><span className="text-foreground">Business transfers</span> — in connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. AI Voice Agent (Aria)</h2>
            <p>
              Our Service includes an AI-powered voice agent named Aria. When you interact with Aria,
              your voice input is processed to understand and respond to your requests, including booking
              appointments. Voice interactions may be recorded and analyzed to improve the quality of
              our Service. By using the voice agent, you consent to this processing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information,
              including encryption, secure servers, and access controls. However, no method of
              transmission over the Internet or electronic storage is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes
              outlined in this policy, unless a longer retention period is required or permitted by law.
              Contact form submissions are retained for up to 24 months.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:letsgo@xiilio.ai" className="text-primary hover:underline">
                letsgo@xiilio.ai
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Cookies & Tracking</h2>
            <p>
              We may use cookies and similar tracking technologies to enhance your experience.
              You can control cookie preferences through your browser settings. Disabling cookies
              may affect certain features of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Children's Privacy</h2>
            <p>
              Our Service is not directed to individuals under the age of 16. We do not knowingly
              collect personal information from children. If we become aware that we have collected
              data from a child without parental consent, we will take steps to delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. International Data Transfers</h2>
            <p>
              Xiilio.ai operates from the United Kingdom and the United States. Your information may
              be transferred to and processed in countries other than your own. We ensure appropriate
              safeguards are in place to protect your data in compliance with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page
              with an updated "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">13. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2 text-foreground">
              Xiilio.ai<br />
              Email:{" "}
              <a href="mailto:letsgo@xiilio.ai" className="text-primary hover:underline">
                letsgo@xiilio.ai
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© 2026 Xiilio.ai. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

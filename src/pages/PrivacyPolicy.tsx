import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export default function PrivacyPolicy() {
    const effectiveDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <LegalPageLayout title="Privacy Policy" lastUpdated={effectiveDate}>
            <div className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-10 border-l-4 border-primary bg-primary/5 dark:bg-primary/10 p-6 rounded-r-lg">
                HeartSpeak is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.
            </div>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">1. Information We Collect</h2>
            <p>We may collect:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Account information (name, email address)</li>
                <li>Usage data (interaction logs, feature usage)</li>
                <li>Text input voluntarily submitted for analysis</li>
                <li>Device and browser information</li>
            </ul>
            <p>
                <strong>We do not access your private messaging platforms or third-party accounts without your permission.</strong>
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Provide and improve our AI analysis services</li>
                <li>Maintain and enhance platform performance</li>
                <li>Communicate important updates</li>
                <li>Ensure security and prevent abuse</li>
            </ul>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">3. Data Retention</h2>
            <p>
                We retain data only for as long as necessary to provide services and comply with legal obligations.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">4. Data Sharing</h2>
            <p>
                <strong>We do not sell your personal data.</strong>
            </p>
            <p>
                We may share limited data with trusted service providers (e.g., hosting or analytics providers) strictly for operational purposes.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">5. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Access your personal data</li>
                <li>Request correction</li>
                <li>Request deletion</li>
                <li>Withdraw consent</li>
            </ul>
            <p>
                To exercise your rights, contact: <a href="mailto:support@heartspeak.click">support@heartspeak.click</a>
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">6. Security Measures</h2>
            <p>
                We implement reasonable technical and organizational safeguards to protect your information.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">7. Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy periodically. Continued use of the service constitutes acceptance of changes.
            </p>
        </LegalPageLayout>
    );
}

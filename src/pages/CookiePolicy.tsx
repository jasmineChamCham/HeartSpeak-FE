import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export default function CookiePolicy() {
    const effectiveDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <LegalPageLayout title="Cookie Policy" lastUpdated={effectiveDate}>
            <p>
                HeartSpeak uses cookies to enhance your experience.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">1. What Are Cookies?</h2>
            <p>
                Cookies are small text files stored on your device to improve functionality and performance.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">2. Types of Cookies We Use</h2>
            <ul className="list-disc pl-6 space-y-4 mb-6">
                <li>
                    <strong>Essential Cookies</strong> – required for website functionality
                </li>
                <li>
                    <strong>Performance Cookies</strong> – help us understand how users interact with our site
                </li>
                <li>
                    <strong>Functional Cookies</strong> – remember preferences
                </li>
            </ul>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">3. Managing Cookies</h2>
            <p>
                You can modify your browser settings to refuse cookies. However, some features may not function properly.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">4. Third-Party Cookies</h2>
            <p>
                We may use trusted third-party analytics services that place cookies to help us improve our platform.
            </p>
        </LegalPageLayout>
    );
}

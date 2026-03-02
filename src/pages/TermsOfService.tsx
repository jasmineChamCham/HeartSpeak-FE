import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export default function TermsOfService() {
    const effectiveDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <LegalPageLayout title="Terms of Service" lastUpdated={effectiveDate}>
            <p>
                By accessing or using HeartSpeak, you agree to these Terms.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">1. Description of Service</h2>
            <p>
                HeartSpeak provides AI-powered emotional and communication analysis based on user-submitted text. The service is intended for informational and self-reflection purposes only.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">2. No Professional Advice</h2>
            <p>
                HeartSpeak does not provide medical, psychological, legal, or therapeutic advice. Users should seek professional assistance when necessary.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">3. User Responsibilities</h2>
            <p>You agree:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Not to use the service for unlawful purposes</li>
                <li>Not to submit harmful, abusive, or illegal content</li>
                <li>Not to attempt to reverse-engineer or disrupt the system</li>
            </ul>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">4. Account Security</h2>
            <p>
                You are responsible for maintaining the confidentiality of your account credentials.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">5. Limitation of Liability</h2>
            <p>
                HeartSpeak is provided "as is" without warranties of any kind. We are not liable for decisions made based on AI-generated analysis.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">6. Termination</h2>
            <p>
                We reserve the right to suspend or terminate accounts that violate these terms.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">7. Modifications</h2>
            <p>
                We may update these Terms from time to time. Continued use constitutes acceptance.
            </p>
        </LegalPageLayout>
    );
}

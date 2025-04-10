import { CheckCircle } from 'lucide-react';

import { Button } from '@/modules/ui/button';
import { Card, CardContent } from '@/modules/ui/card';

export default function LandingPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Automate Your Journal Workflow</h1>
        <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
          From <b>writing</b> to <b>editing</b> to <b>presenting</b> Dergi-M streamlines your entire
          publishing process.
        </p>
      </section>

      {/* Features Section */}
      <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            title: 'Project-Based Workflow',
            description:
              'Manage your journals like agile projects. Boards, tasks, and stages—all in one place.',
          },
          {
            title: 'Powerful Document Editor',
            description:
              'Write, edit, and collaborate in real-time with our Google Docs-style editor.',
          },
          {
            title: 'Smart File Management',
            description:
              'Upload, preview, and organize your .doc and .pdf files easily and efficiently.',
          },
        ].map((feature, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-3">
                <CheckCircle className="text-primary" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Call to Action Section */}
      <section className="text-center">
        <h2 className="mb-4 text-2xl font-bold md:text-3xl">
          Ready to streamline your editorial process?
        </h2>
        <Button size="lg">Get Started</Button>
      </section>
    </main>
  );
}

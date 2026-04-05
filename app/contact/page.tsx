"use client";

export const dynamic = "force-dynamic";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/translations";

export default function ContactPage() {
  const { language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir}>
      <main className="min-h-screen bg-background">
        <Navbar />

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display mb-4">
                  {t("contactUs", language)}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {t("contactDesc", language)}
                </p>
              </div>

              <form className="space-y-6 bg-card rounded-2xl p-8 shadow-sm border border-border/50">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2 font-display"
                  >
                    {t("yourName", language)}
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("namePlaceholder", language)}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2 font-display"
                  >
                    {t("yourEmail", language)}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder", language)}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-foreground mb-2 font-display"
                  >
                    {t("subject", language)}
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder={t("subjectPlaceholder", language)}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2 font-display"
                  >
                    {t("message", language)}
                  </label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder={t("messagePlaceholder", language)}
                    className="rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full bg-primary hover:bg-primary/90 font-display"
                >
                  {t("sendMessage", language)}
                </Button>
              </form>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

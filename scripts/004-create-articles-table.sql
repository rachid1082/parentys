-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID REFERENCES experts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  title_en TEXT,
  title_fr TEXT,
  title_ar TEXT,
  content TEXT,
  content_en TEXT,
  content_fr TEXT,
  content_ar TEXT,
  excerpt TEXT,
  excerpt_en TEXT,
  excerpt_fr TEXT,
  excerpt_ar TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'rejected', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Create article_categories junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS article_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, category_id)
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for articles
CREATE POLICY "Anyone can view published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Experts can view their own articles" ON articles
  FOR SELECT USING (
    expert_id IN (
      SELECT id FROM experts WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all articles" ON articles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

CREATE POLICY "Experts can insert their own articles" ON articles
  FOR INSERT WITH CHECK (
    expert_id IN (
      SELECT id FROM experts WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Experts can update their own articles" ON articles
  FOR UPDATE USING (
    expert_id IN (
      SELECT id FROM experts WHERE profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can update any article" ON articles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

CREATE POLICY "Admins can delete any article" ON articles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

-- RLS policies for article_categories
CREATE POLICY "Anyone can view article categories" ON article_categories
  FOR SELECT USING (true);

CREATE POLICY "Experts can manage their article categories" ON article_categories
  FOR ALL USING (
    article_id IN (
      SELECT id FROM articles WHERE expert_id IN (
        SELECT id FROM experts WHERE profile_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Admins can manage all article categories" ON article_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_expert_id ON articles(expert_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_article_categories_article_id ON article_categories(article_id);
CREATE INDEX IF NOT EXISTS idx_article_categories_category_id ON article_categories(category_id);

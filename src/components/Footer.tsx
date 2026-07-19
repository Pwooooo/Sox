export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border mt-12">
      <div className="max-w-[1400px] mx-auto px-6 py-12 flex justify-between gap-12 flex-wrap">
        <div>
          <div className="w-[34px] h-[34px] bg-primary text-white rounded-[9px] flex items-center justify-center font-extrabold text-[17px] mb-3">
            N
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">
            The next generation UGC platform.
          </p>
        </div>
        <div className="flex gap-12 flex-wrap">
          {[
            { title: 'Platform', links: ['Marketplace', 'Create', 'Avatar', 'Groups'] },
            { title: 'Support', links: ['Help Center', 'Safety', 'Terms', 'Privacy'] },
            { title: 'Social', links: ['Twitter', 'Discord', 'YouTube', 'Blog'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {col.title}
              </h4>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors no-underline mb-2"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="text-center py-6 text-xs text-muted-foreground border-t border-border">
        &copy; 2026 Novelo. All rights reserved.
      </div>
    </footer>
  )
}

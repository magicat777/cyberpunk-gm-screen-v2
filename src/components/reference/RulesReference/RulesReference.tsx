import React, { useState, useMemo } from 'react';
import { rulesData, ruleCategories, quickRefSections } from '@/data/rules/rulesData';
import styles from './RulesReference.module.css';

export const RulesReference: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickRef, setShowQuickRef] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Filter rules based on category and search
  const filteredRules = useMemo(() => {
    let rules = showQuickRef ? quickRefSections : rulesData;
    
    if (selectedCategory !== 'all') {
      rules = rules.filter(rule => rule.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      rules = rules.filter(rule => 
        rule.title.toLowerCase().includes(query) ||
        rule.content.toLowerCase().includes(query) ||
        rule.category.toLowerCase().includes(query) ||
        (rule.subcategory && rule.subcategory.toLowerCase().includes(query))
      );
    }
    
    return rules;
  }, [selectedCategory, searchQuery, showQuickRef]);

  // Group rules by category
  const groupedRules = useMemo(() => {
    const groups: Record<string, typeof rulesData> = {};
    
    filteredRules.forEach(rule => {
      if (!groups[rule.category]) {
        groups[rule.category] = [];
      }
      groups[rule.category].push(rule);
    });
    
    return groups;
  }, [filteredRules]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const formatContent = (content: string) => {
    // Convert markdown-style formatting to HTML
    return content
      .split('\n')
      .map(line => {
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Lists
        if (line.startsWith('- ')) {
          return `<li>${line.substring(2)}</li>`;
        }
        return line;
      })
      .join('<br />');
  };

  return (
    <div className={styles.rulesReference}>
      <div className={styles.header}>
        <h1 className={styles.title}>Rules Reference</h1>
        
        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search rules"
            />
          </div>
          
          <div className={styles.filterContainer}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categorySelect}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {ruleCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            
            <button
              className={`${styles.quickRefToggle} ${showQuickRef ? styles.active : ''}`}
              onClick={() => setShowQuickRef(!showQuickRef)}
              aria-pressed={showQuickRef}
              aria-label="Toggle quick reference only"
            >
              Quick Reference
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {Object.entries(groupedRules).map(([category, rules]) => (
          <div key={category} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            
            <div className={styles.rulesList}>
              {rules.map(rule => (
                <div
                  key={rule.id}
                  className={`${styles.ruleCard} ${expandedSections.has(rule.id) ? styles.expanded : ''}`}
                >
                  <div
                    className={styles.ruleHeader}
                    onClick={() => toggleSection(rule.id)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={expandedSections.has(rule.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSection(rule.id);
                      }
                    }}
                  >
                    <div className={styles.ruleTitle}>
                      <h3>{rule.title}</h3>
                      {rule.subcategory && (
                        <span className={styles.subcategory}>{rule.subcategory}</span>
                      )}
                    </div>
                    
                    <div className={styles.ruleIndicators}>
                      {rule.quickRef && (
                        <span className={styles.quickRefBadge}>Quick Ref</span>
                      )}
                      <span className={styles.expandIcon}>
                        {expandedSections.has(rule.id) ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                  
                  {expandedSections.has(rule.id) && (
                    <div className={styles.ruleContent}>
                      <div 
                        dangerouslySetInnerHTML={{ __html: formatContent(rule.content) }}
                      />
                      
                      {rule.related && rule.related.length > 0 && (
                        <div className={styles.relatedSection}>
                          <h4>Related Topics:</h4>
                          <div className={styles.relatedLinks}>
                            {rule.related.map(relatedId => {
                              const relatedRule = rulesData.find(r => r.id === relatedId);
                              return relatedRule ? (
                                <button
                                  key={relatedId}
                                  className={styles.relatedLink}
                                  onClick={() => {
                                    setSearchQuery(relatedRule.title);
                                    setSelectedCategory('all');
                                    toggleSection(relatedId);
                                  }}
                                >
                                  {relatedRule.title}
                                </button>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                      
                      {rule.page && (
                        <div className={styles.pageRef}>
                          Core Rulebook p.{rule.page}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {filteredRules.length === 0 && (
          <div className={styles.noResults}>
            <p>No rules found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
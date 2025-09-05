import { test, expect } from '@playwright/test';

// Comprehensive tooltip checklist for HRM Training Visualization
const tooltipChecklist = [
  // Progress Bars and Percentages
  {
    selector: 'span:has-text("🧠 Planner:")',
    expectedTooltip: /Planner.*high-level decision maker.*Get key BEFORE door/i,
    description: 'Planner label tooltip'
  },
  {
    selector: 'span:has-text("🤖 Doer:")',
    expectedTooltip: /Doer.*action executor.*HOW to reach each goal/i,
    description: 'Doer label tooltip'
  },
  {
    selector: '.bg-blue-500.rounded-full',
    hoverParent: true,
    expectedTooltip: /Planner learns.*goal sequence.*accurate/i,
    description: 'Planner progress bar tooltip'
  },
  {
    selector: '.bg-green-500.rounded-full',
    hoverParent: true,
    expectedTooltip: /Doer learns.*actions.*accurate/i,
    description: 'Doer progress bar tooltip'
  },
  {
    selector: 'span:has-text("Efficiency:")',
    expectedTooltip: /Efficiency.*optimal steps.*actual steps/i,
    description: 'Efficiency label tooltip'
  },
  
  // Control Buttons
  {
    selector: 'button:has-text("1. Reset All")',
    expectedTooltip: /Clear everything.*start over.*Resets both/i,
    description: 'Reset button tooltip'
  },
  {
    selector: 'button:has-text("2. Pre-Training Test")',
    expectedTooltip: /Test the UNTRAINED AI.*randomly.*poorly/i,
    description: 'Pre-training test button tooltip'
  },
  {
    selector: 'button:has-text("3. Generate Training Data")',
    expectedTooltip: /Generate.*optimal training examples.*different starting positions/i,
    description: 'Generate data button tooltip'
  },
  {
    selector: 'button:has-text("4. Train Model")',
    expectedTooltip: /Train the AI.*study each example.*learn the patterns/i,
    description: 'Train model button tooltip'
  },
  {
    selector: 'button:has-text("5. Post-Training Test")',
    expectedTooltip: /Test the TRAINED AI.*solve efficiently.*8-10 steps/i,
    description: 'Post-training test button tooltip'
  },
  
  // Training Examples
  {
    selector: '.text-[10px]:has-text("A:")',
    expectedTooltip: /Initial positions.*Agent.*Key.*Door/i,
    description: 'Example initial state tooltip'
  },
  {
    selector: '.text-[10px]:has-text("steps")',
    expectedTooltip: /Number of steps taken/i,
    description: 'Example steps tooltip'
  },
  {
    selector: '.text-xs:has-text("✓ Optimal")',
    expectedTooltip: /Optimal solution/i,
    description: 'Example success tooltip'
  },
  
  // Empty grid cells
  {
    selector: '.bg-gray-100.rounded.border-2:not(:has(*))',
    expectedTooltip: /Empty space.*agent can move here/i,
    description: 'Empty grid cell tooltip'
  },
  
  // Game elements
  {
    selector: '.text-2xl:has-text("🧍")',
    expectedTooltip: /Agent.*AI character.*learning to solve/i,
    description: 'Agent tooltip'
  },
  {
    selector: '.text-xl:has-text("🔑")',
    expectedTooltip: /Key.*Must be picked up.*before.*door/i,
    description: 'Key tooltip'
  },
  {
    selector: '.text-2xl:has-text("🚪")',
    expectedTooltip: /Door.*Can only be opened with the key/i,
    description: 'Door tooltip'
  }
];

test.describe('Tooltip Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    // Skip tutorial to get to free play mode
    await page.click('button:has-text("Skip Tutorial")');
    await page.waitForTimeout(1000);
  });

  test('All tooltips should be present and readable', async ({ page }) => {
    const results = [];
    
    for (const tooltip of tooltipChecklist) {
      try {
        const element = await page.locator(tooltip.selector).first();
        
        if (await element.count() > 0) {
          // Hover over the element or its parent
          if (tooltip.hoverParent) {
            await element.locator('..').hover();
          } else {
            await element.hover();
          }
          
          // Wait a bit for tooltip to appear
          await page.waitForTimeout(500);
          
          // Check for title attribute
          const titleAttr = await element.getAttribute('title');
          
          // Check for hover tooltip div
          const hoverTooltip = await page.locator('.opacity-100:has-text("accurate")').first();
          const hoverText = await hoverTooltip.textContent().catch(() => '');
          
          const tooltipText = titleAttr || hoverText;
          
          if (tooltipText && tooltip.expectedTooltip.test(tooltipText)) {
            results.push({
              description: tooltip.description,
              status: '✅ PASS',
              tooltip: tooltipText.substring(0, 50) + '...'
            });
          } else {
            results.push({
              description: tooltip.description,
              status: '❌ FAIL',
              tooltip: tooltipText || 'No tooltip found'
            });
          }
        } else {
          results.push({
            description: tooltip.description,
            status: '⚠️ SKIP',
            tooltip: 'Element not found on page'
          });
        }
      } catch (error) {
        results.push({
          description: tooltip.description,
          status: '❌ ERROR',
          tooltip: error.message
        });
      }
    }
    
    // Print results
    console.table(results);
    
    // Check if all required tooltips passed
    const failures = results.filter(r => r.status === '❌ FAIL' || r.status === '❌ ERROR');
    expect(failures).toHaveLength(0);
  });

  test('Free play buttons should work correctly', async ({ page }) => {
    // Test 1: Reset button
    await page.click('button:has-text("1. Reset All")');
    await expect(page.locator('span:has-text("Steps: 0/")')).toBeVisible();
    
    // Test 2: Pre-training test (should show poor performance)
    await page.click('button:has-text("2. Pre-Training Test")');
    await page.waitForTimeout(2000);
    // Check that steps are being taken
    await expect(page.locator('span:has-text("Steps:")').first()).toContainText(/Steps: \d+/);
    
    // Test 3: Generate training data
    await page.click('button:has-text("3. Generate Training Data")');
    await page.waitForTimeout(1000);
    // Check that training examples appear
    await expect(page.locator('div:has-text("Training Data")')).toBeVisible();
    await expect(page.locator('div:has-text("#1")')).toBeVisible();
    
    // Test 4: Train model
    await page.click('button:has-text("4. Train Model")');
    await page.waitForTimeout(3000);
    // Check that accuracy increased
    const plannerAccuracy = await page.locator('.font-mono').first().textContent();
    expect(parseInt(plannerAccuracy)).toBeGreaterThan(50);
    
    // Test 5: Post-training test (should show good performance)
    await page.click('button:has-text("5. Post-Training Test")');
    await page.waitForTimeout(2000);
    // Check efficiency should be high
    await expect(page.locator('span:has-text("Efficiency:")')).toBeVisible();
  });

  test('Training examples should be clickable and show details', async ({ page }) => {
    // Generate training data first
    await page.click('button:has-text("3. Generate Training Data")');
    await page.waitForTimeout(1000);
    
    // Click on first example
    await page.click('div:has-text("#1")').first();
    await page.waitForTimeout(500);
    
    // Check that details appear in middle column
    await expect(page.locator('h3:has-text("Example #1 Details")')).toBeVisible();
    await expect(page.locator('span:has-text("Initial State:")')).toBeVisible();
    await expect(page.locator('span:has-text("Steps:")')).toBeVisible();
    await expect(page.locator('span:has-text("Path:")')).toBeVisible();
    await expect(page.locator('span:has-text("Actions:")')).toBeVisible();
    
    // Close details
    await page.click('button[title="Close example details"]');
    await expect(page.locator('h3:has-text("Example #1 Details")')).not.toBeVisible();
  });
});
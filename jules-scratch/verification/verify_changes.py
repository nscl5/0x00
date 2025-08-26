import re
from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:3000/")

        # Use a user-facing locator to find the file input
        file_input = page.locator('input[type="file"]')

        # Set the file to be uploaded
        file_input.set_input_files("dummy_code.py")

        # Give it a moment to process the file upload
        time.sleep(2)

        # Click the "Analyze Code" button
        page.get_by_role("button", name="تحلیل کد").click()

        # Wait for the error message to appear
        expect(page.get_by_role("heading", name="خطا در تحلیل")).to_be_visible(timeout=60000)

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

    except Exception as e:
        print(f"An error occurred: {e}")
        print("Page content:")
        print(page.content())
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)

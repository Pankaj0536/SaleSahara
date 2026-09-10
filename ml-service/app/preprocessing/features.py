import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple

FEATURE_COLUMNS = [
    'budget',
    'expectedDealValue',
    'companySize',
    'industry',
    'source',
    'websiteVisits',
    'pricingVisits',
    'productVisits',
    'emailOpens',
    'emailClicks',
    'emailReplies',
    'demoRequests',
    'calls',
    'meetings',
    'documentDownloads',
    'daysSinceFirstActivity',
    'daysSinceLastActivity',
    'activityFrequency',
    'engagementVelocity',
    'highIntentActions',
    'recentActivityCount',
    'pricingToDemoRatio',
    'emailResponseRate',
    'engagementTrend',
    'engagementScore'
]

CATEGORICAL_FEATURES = ['companySize', 'industry', 'source', 'engagementTrend']

NUMERICAL_FEATURES = [c for c in FEATURE_COLUMNS if c not in CATEGORICAL_FEATURES]

ACTIVITY_VOCAB = {
    '<PAD>': 0,
    'website_visit': 1,
    'pricing_visit': 2,
    'product_visit': 3,
    'email_open': 4,
    'email_click': 5,
    'email_reply': 6,
    'demo_request': 7,
    'form_submission': 8,
    'phone_call': 9,
    'meeting': 10,
    'document_download': 11,
    'whatsapp_click': 12
}

def features_to_dataframe(feature_dict: Dict[str, Any]) -> pd.DataFrame:
    """Convert raw feature dict into a single-row DataFrame aligned with training columns."""
    row = dict(feature_dict)
    
    # Auto-calculate derived features if not explicitly provided
    demo_requests = float(row.get('demoRequests', 0))
    pricing_visits = float(row.get('pricingVisits', 0))
    meetings = float(row.get('meetings', 0))
    email_opens = float(row.get('emailOpens', 0))
    email_replies = float(row.get('emailReplies', 0))
    website_visits = float(row.get('websiteVisits', 0))
    days_since_last = float(row.get('daysSinceLastActivity', 1))
    
    if 'highIntentActions' not in row:
        row['highIntentActions'] = (demo_requests * 3) + (pricing_visits * 2) + (meetings * 3)
    if 'recentActivityCount' not in row:
        row['recentActivityCount'] = int(np.clip(7.0 / (days_since_last + 1), 0, 10))
    if 'engagementVelocity' not in row:
        row['engagementVelocity'] = round(float(row['recentActivityCount']) / 7.0, 3)
    if 'pricingToDemoRatio' not in row:
        row['pricingToDemoRatio'] = demo_requests / max(1.0, pricing_visits) if pricing_visits > 0 else demo_requests
    if 'emailResponseRate' not in row:
        row['emailResponseRate'] = email_replies / max(1.0, email_opens) if email_opens > 0 else 0.0
    if 'engagementScore' not in row:
        decay = np.exp(-0.05 * days_since_last)
        raw_score = (website_visits * 2 + pricing_visits * 6 + email_opens * 2 + email_replies * 8 +
                     demo_requests * 15 + meetings * 12) * decay
        row['engagementScore'] = float(np.clip(raw_score, 0, 100))
    if 'daysSinceFirstActivity' not in row:
        row['daysSinceFirstActivity'] = max(days_since_last, 10.0)
    if 'activityFrequency' not in row:
        row['activityFrequency'] = (website_visits + email_opens + pricing_visits + demo_requests) / max(1.0, row['daysSinceFirstActivity'])
    if 'expectedDealValue' not in row:
        row['expectedDealValue'] = float(row.get('budget', 15000)) * 1.1

    aligned_row = {}
    for col in FEATURE_COLUMNS:
        aligned_row[col] = row.get(col, 0.0 if col in NUMERICAL_FEATURES else "Unknown")
        
    df = pd.DataFrame([aligned_row])
    # Ensure proper data types
    for num_col in NUMERICAL_FEATURES:
        df[num_col] = pd.to_numeric(df[num_col], errors='coerce').fillna(0.0)
    for cat_col in CATEGORICAL_FEATURES:
        df[cat_col] = df[cat_col].astype(str)
    return df

def encode_sequence(activity_list: List[str], max_len: int = 20) -> np.ndarray:
    """Encodes activity names to integer tokens padded to max_len."""
    tokens = [ACTIVITY_VOCAB.get(act, 0) for act in activity_list[-max_len:]]
    if len(tokens) < max_len:
        tokens = [0] * (max_len - len(tokens)) + tokens
    return np.array(tokens, dtype=np.int64)

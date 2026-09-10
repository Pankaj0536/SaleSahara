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
    row = {}
    for col in FEATURE_COLUMNS:
        row[col] = feature_dict.get(col, 0.0 if col in NUMERICAL_FEATURES else "Unknown")
    df = pd.DataFrame([row])
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

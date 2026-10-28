"""Una CI vacía, antigua, omitida o de otro SHA no cierra EP10."""
import unittest
from observe_ci import assess,REQUIRED,STEPS

SHA='1'*40

def success():
    return [{'id':i,'name':name,'head_sha':SHA,'head_branch':'main','event':'push','run_number':1,'run_attempt':1,'status':'completed','conclusion':'success',
             'jobs':[{'name':job,'conclusion':'success','steps':[{'name':step,'conclusion':'success'} for step in STEPS[job]]} for job in jobs]} for i,(name,jobs) in enumerate(REQUIRED.items(),1)]

class Observation(unittest.TestCase):
    def test_requires_runs(self):self.assertFalse(assess(SHA,SHA,[])['ciPassed'])
    def test_accepts_exact_successful_main(self):self.assertTrue(assess(SHA,SHA,success())['ciPassed'])
    def test_rejects_old_or_different_main(self):self.assertFalse(assess(SHA,'2'*40,success())['ciPassed'])
    def test_rejects_skipped_required_jobs(self):
        runs=success();runs[0]['jobs'][0]['conclusion']='skipped'
        self.assertFalse(assess(SHA,SHA,runs)['ciPassed'])
    def test_rejects_empty_steps_even_if_success_label(self):
        runs=success();runs[0]['jobs'][0]['steps']=[]
        self.assertFalse(assess(SHA,SHA,runs)['ciPassed'])
    def test_latest_attempt_takes_precedence(self):
        runs=success();failed={**runs[0],'run_attempt':2,'conclusion':'failure'}
        self.assertFalse(assess(SHA,SHA,runs+[failed])['ciPassed'])
    def test_rejects_successful_setup_with_skipped_test(self):
        runs=success();runs[0]['jobs'][0]['steps']=[{'name':'Set up job','conclusion':'success'},{'name':next(iter(STEPS[runs[0]['jobs'][0]['name']])),'conclusion':'skipped'}]
        self.assertFalse(assess(SHA,SHA,runs)['ciPassed'])
    def test_rejects_pull_request_result(self):
        runs=success();runs[0]['event']='pull_request'
        self.assertFalse(assess(SHA,SHA,runs)['ciPassed'])

if __name__=='__main__':unittest.main()
